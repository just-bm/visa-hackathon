import { connectToMongo, connectToPostgres } from "../utils/db.js";
import { buildFullMetadata } from "../utils/metadataExtractor.js";

/* ---------------------------
  Main controller: MongoDB
---------------------------- */
export const tableMetaDataExtractionMongo = async (req, res) => {
  try {
    const { uri, dbName, collectionName } = req.body;
    if (!uri || !dbName || !collectionName)
      return res.status(400).json({ message: "Missing parameters" });

    const client = await connectToMongo(uri);
    const collection = client.db(dbName).collection(collectionName);
    const rows = await collection.find({}).limit(1000).toArray(); // Added limit for safety

    const metadata = buildFullMetadata(rows, collectionName);
    res.json(metadata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ---------------------------
  Main controller: PostgreSQL
---------------------------- */
export const tableMetaDataExtractionPostgres = async (req, res) => {
  try {
    const { connectionString, tableName } = req.body;
    if (!connectionString || !tableName)
      return res.status(400).json({ message: "Missing parameters" });

    // Validate table name to prevent SQL injection
    if (!/^[a-zA-Z_][a-zA-Z0-9_.]*$/.test(tableName)) {
      return res.status(400).json({ message: "Invalid table name" });
    }

    const client = await connectToPostgres(connectionString);

    const { rows } = await client.query(`SELECT * FROM "${tableName}" LIMIT 1000`);

    const metadata = buildFullMetadata(rows, tableName);
    res.json(metadata);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
