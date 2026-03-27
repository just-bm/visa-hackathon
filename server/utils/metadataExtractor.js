import crypto from "crypto";

const DATE_PATTERNS = [
  /^\d{4}-\d{2}-\d{2}/,        // YYYY-MM-DD
  /^\d{2}\/\d{2}\/\d{4}/,       // MM/DD/YYYY or DD/MM/YYYY
  /^\d{2}\/\d{4}/,             // MM/YYYY
  /^\d{4}$/                    // YYYY (only if reasonable range)
];

const isLikelyDate = (v) => {
  if (typeof v !== 'string' || v.trim() === '') return false;
  if (!isNaN(v) && (v.length > 4 || Number(v) > 2100)) return false; 
  return DATE_PATTERNS.some(p => p.test(v)) && !isNaN(Date.parse(v));
};

export const inferType = (values) => {
  if (values.every((v) => !isNaN(v) && v !== "")) return "numeric";
  if (values.every((v) => isLikelyDate(v))) return "datetime";
  return "string";
};

export const extractDatasetMetadata = (rows, sourceName, domain = "Unknown") => ({
  dataset_id: crypto.randomUUID(),
  dataset_name: sourceName,
  row_count: rows.length,
  column_count: rows.length ? Object.keys(rows[0]).length : 0,
  detected_domain: domain,
  ingestion_timestamp: new Date().toISOString(),
});

export const extractColumnMetadata = (rows) => {
  const columns = Object.keys(rows[0] || {});
  const rowCount = rows.length;

  return columns.map((col) => {
    const values = rows.map((r) => r[col]);
    const nonNull = values.filter((v) => v !== "" && v != null);
    const unique = new Set(nonNull);

    return {
      column_name: col,
      inferred_data_type: inferType(nonNull),
      null_count: rowCount - nonNull.length,
      null_ratio: (rowCount - nonNull.length) / rowCount,
      unique_count: unique.size,
      unique_ratio: unique.size / rowCount,
      sample_values_masked: nonNull.slice(0, 3).map(() => "***"),
    };
  });
};

export const extractNumericStats = (rows) => {
  const stats = {};
  Object.keys(rows[0] || {}).forEach((col) => {
    const nums = rows.map((r) => Number(r[col])).filter((v) => !isNaN(v));
    if (!nums.length) return;

    stats[col] = {
      min_value: Math.min(...nums),
      max_value: Math.max(...nums),
      mean: nums.reduce((a, b) => a + b, 0) / nums.length,
      negative_value_ratio: nums.filter((v) => v < 0).length / nums.length,
    };
  });
  return stats;
};

export const extractCategoricalStats = (rows) => {
  const stats = {};
  Object.keys(rows[0] || {}).forEach((col) => {
    const values = rows.map((r) => r[col]).filter(Boolean);
    const freq = {};
    values.forEach((v) => (freq[v] = (freq[v] || 0) + 1));
    const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
    if (sorted.length) {
      stats[col] = {
        distinct_values: sorted.length,
        top_values: sorted.slice(0, 3).map((v) => v[0]),
      };
    }
  });
  return stats;
};

export const extractTemporalStats = (rows) => {
  const stats = {};
  Object.keys(rows[0] || {}).forEach((col) => {
    const colLower = col.toLowerCase();
    if (colLower === "id" || colLower.includes("_id") || colLower.includes("client_id")) return;
    const dateValues = rows.map((r) => r[col]).filter((v) => isLikelyDate(v));
    const isYearColumn = colLower.includes("year") || colLower.includes("date") || colLower.includes("time") || colLower.includes("at");
    const dates = dateValues.map((v) => {
        if (/^\d{4}$/.test(v) && !isYearColumn) return null;
        const d = new Date(v);
        return isNaN(d) ? null : d;
    }).filter(Boolean);
    
    if (dates.length < rows.length * 0.1) return; 

    const now = new Date();
    stats[col] = {
      min_timestamp: new Date(Math.min(...dates)).toISOString(),
      max_timestamp: new Date(Math.max(...dates)).toISOString(),
      future_timestamp_ratio: dates.filter((d) => d > now).length / dates.length,
      stale_record_ratio:
        dates.filter((d) => now - d > 365 * 24 * 60 * 60 * 1000).length / dates.length,
    };
  });
  return stats;
};

export const extractPatterns = (rows) => {
  const patterns = {};
  Object.keys(rows[0] || {}).forEach((col) => {
    const values = rows.map((r) => r[col]).filter(Boolean);
    const regex = /^[A-Z]{3}\d+/; // Example pattern
    const matches = values.filter((v) => regex.test(v)).length;
    if (matches > 0) {
      patterns[col] = {
        regex_match_ratio: matches / values.length,
      };
    }
  });
  return patterns;
};

export const extractComplianceFlags = (columns) => {
  const columnNamesLower = columns.map((c) => c.column_name.toLowerCase());
  return {
    kyc_fields_present: columnNamesLower.some(
      (n) => n.includes("kyc") || n.includes("address")
    ),
    monetary_fields_present: columnNamesLower.some(
      (n) => n.includes("amount") || n.includes("price")
    ),
    personal_data_present: columnNamesLower.some((n) =>
      ["name", "email", "phone"].some((p) => n.includes(p))
    ),
  };
};

export const buildFullMetadata = (rows, sourceName, domain = "Unknown") => {
  const dataset = extractDatasetMetadata(rows, sourceName, domain);
  const columns = extractColumnMetadata(rows);

  return {
    dataset,
    columns,
    numeric_stats: extractNumericStats(rows),
    categorical_stats: extractCategoricalStats(rows),
    temporal_stats: extractTemporalStats(rows),
    patterns: extractPatterns(rows),
    compliance_flags: extractComplianceFlags(columns),
  };
};
