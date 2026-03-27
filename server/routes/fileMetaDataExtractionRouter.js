import { Router } from "express";
import { fileMetaDataExtraction } from "../controllers/file.controller.js";

const router = Router();

router.post("/", fileMetaDataExtraction);

export default router;