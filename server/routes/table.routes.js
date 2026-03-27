import Router from "express";
import { tableMetaDataExtractionMongo, tableMetaDataExtractionPostgres } from "../controllers/table.controller.js";

const router = Router();

router.post("/mongo", tableMetaDataExtractionMongo);
router.post("/postgres", tableMetaDataExtractionPostgres);

export default router;