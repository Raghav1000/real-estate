import { Router } from "express";
import { googleAuth, signIn, signUp } from "../controllers/auth.js";

const router = Router();

router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/google', googleAuth)

export default router