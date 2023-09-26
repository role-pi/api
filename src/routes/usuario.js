import express from 'express';
import { signInUsuario, getUsuarios, putUsuario, verifyUsuario, loginUsuario, deleteUsuario, uploadProfilePicture } from "../controllers/usuario.js"
import { verifyToken } from '../middlewares/verification.js';
import { upload } from '../services/imagens.js';

const router = express.Router()

router.get('/:id_evento', verifyToken, getUsuarios);
router.get('/', verifyToken, loginUsuario);
router.put('/', verifyToken, putUsuario);
router.delete('/:id_usuario', verifyToken, deleteUsuario);

// Sign in
router.post('/signin', signInUsuario);
router.post('/verify', verifyUsuario);
router.post('/image', upload.single('profile'), uploadProfilePicture);

export default router;