import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import fileMetaDataExtraction from "./routes/fileMetaDataExtractionRouter.js";
import tableRoutes from "./routes/table.routes.js";
import apiRoutes from "./routes/api.routes.js";
import { CORS_ORIGIN } from "./utils/env.js";
import{  limiter, fileLimiter } from "./utils/limiter.js";
 
const app = express();

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(helmet());
app.use(limiter);
app.use(fileLimiter);

app.get('/', (_req, res) => 
  res.json({ message: 'DQS-AI Backend',
    endpoints: [
      "/api/csv",
      "/api/db",
      "/api"
   ]}));

app.get('/api/health', (_req, res) => 
  res.json({ status: 'ok', now: new Date() }));

app.use("/api/csv", fileMetaDataExtraction);
app.use("/api/db", tableRoutes);
app.use("/api", apiRoutes);

export default app;