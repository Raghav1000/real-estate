import { Router } from "express";
import { deleteUser, getUser, updateUser } from "../controllers/user.js";
import { verifyToken } from "../utils/verifyUserTOken.js";

const router = Router()

router.get('/', getUser);
router.post('/update/:id', verifyToken, updateUser)
router.delete('/delete/:id', verifyToken, deleteUser)

export default router;