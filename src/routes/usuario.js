import express from 'express';
import { signInUsuario, getUsuarios, verifyUsuario, loginUsuario } from "../controllers/usuario.js"
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/', verifyToken, getUsuarios);
router.post('/signin', signInUsuario);
router.post('/verify', verifyUsuario);
router.post('/login', verifyToken, loginUsuario);

export default router;