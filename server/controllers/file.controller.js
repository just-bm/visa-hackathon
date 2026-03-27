import csv from "csv-parser";
import { Readable } from "stream";
import { buildFullMetadata } from "../utils/metadataExtractor.js";

export const parseCSV = (buffer) => {
  return new Promise((resolve, reject) => {
    const rows = [];
    Readable.from(buffer)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", (err) => reject(err));
  });
};

export const fileMetaDataExtraction = async (req, res) => {
  try {
    const file = req.files?.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    if (!file.name.toLowerCase().endsWith('.csv')) {
      return res.status(400).json({ message: "Only CSV files are supported" });
    }

    const rows = await parseCSV(file.data);
    const extractedMetadata = buildFullMetadata(rows, file.name);

    res.json(extractedMetadata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
