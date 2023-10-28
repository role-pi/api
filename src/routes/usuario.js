import express from 'express';
import { signInUser, getUsers, putUser, verifyUser, loginUser, deleteUser, uploadProfilePicture } from "../controllers/usuario.js"
import { verifyToken } from '../middlewares/verification.js';
import { upload } from '../services/imagens.js';

const router = express.Router()

router.get('/:id_evento', verifyToken, getUsers);
router.get('/', verifyToken, loginUser);
router.put('/', verifyToken, putUser);
router.delete('/:id_usuario', verifyToken, deleteUser);

// Sign in
router.post('/signin', signInUser);
router.post('/verify', verifyUser);

// Upload profile picture
router.post('/image', verifyToken, upload.single('profile'), uploadProfilePicture);

export default router;