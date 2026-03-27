import app from "./app.js";
import { PORT } from "./utils/env.js";
import { closeDatabaseConnections } from "./utils/db.js";

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const shutdown = async () => {
  console.log("Shutting down server...");
  try {
    await closeDatabaseConnections();
    server.close(() => {
      console.log("Server stopped.");
      process.exit(0);
    });
  } catch (err) {
    console.error("Error during shutdown:", err);
    process.exit(1);
  }
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);