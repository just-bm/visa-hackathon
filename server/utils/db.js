import { MongoClient } from "mongodb";
import pkg from "pg";
const { Client: PGClient } = pkg;

const mongoClients = new Map();
const pgClients = new Map();

/* ---------------------------
  MongoDB Connection Handler
---------------------------- */
export async function connectToMongo(uri) {
  if (mongoClients.has(uri)) {
    return mongoClients.get(uri);
  }

  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
  });

  await client.connect();
  mongoClients.set(uri, client);
  console.log(`Connected to MongoDB (Pool Initialized for ${new URL(uri).hostname})`);
  return client;
}

/* ---------------------------
  PostgreSQL Connection Handler
---------------------------- */
export async function connectToPostgres(connectionString) {
  if (pgClients.has(connectionString)) {
    return pgClients.get(connectionString);
  }

  const client = new PGClient({ connectionString });
  await client.connect();
  pgClients.set(connectionString, client);
  console.log("Connected to PostgreSQL");
  return client;
}

/* ---------------------------
  Global Connection Closer
---------------------------- */
export async function closeDatabaseConnections() {
  // Close MongoDB
  for (const [uri, client] of mongoClients.entries()) {
    await client.close();
    console.log(`Closed MongoDB connection to ${new URL(uri).hostname}`);
  }
  mongoClients.clear();

  // Close PostgreSQL
  for (const [connStr, client] of pgClients.entries()) {
    await client.end();
    console.log("Closed PostgreSQL connection");
  }
  pgClients.clear();
}