import express from 'express';
import { signInUsuario, getUsuarios, verifyUsuario, loginUsuario, uploadProfilePicture } from "../controllers/usuario.js"
import { verifyToken } from '../middlewares/verification.js';
import { upload } from '../services/imagens.js';

const router = express.Router()

router.get('/', verifyToken, getUsuarios);
router.post('/signin', signInUsuario);
router.post('/verify', verifyUsuario);
router.post('/login', verifyToken, loginUsuario);
router.post('/image', upload.single('profile'), uploadProfilePicture);

export default router;