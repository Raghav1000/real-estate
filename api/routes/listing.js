import { Router } from "express";
import { createList } from "../controllers/listing.js";
import { verifyToken } from "../utils/verifyUserTOken.js";

const router = Router();

router.post('/create', verifyToken,createList)

export default router