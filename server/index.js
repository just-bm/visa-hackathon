import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import "dotenv/config";
import fileMetaDataExtraction from "./routes/fileMetaDataExtractionRouter.js";
import fileUpload from 'express-fileupload';
import tableRoutes from "./routes/table.routes.js";
import apiRoutes from "./routes/api.routes.js"; 



const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json());
app.use(helmet());
app.use(fileUpload());
app.get('/', (req, res) => res.json({ message: 'Hello from Express' }));
app.get('/api/health', (req, res) => res.json({ status: 'ok', now: new Date() }));
app.use("/api/file-csv", fileMetaDataExtraction);
app.use("/api/tables", tableRoutes);
app.use("/api", apiRoutes);

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});