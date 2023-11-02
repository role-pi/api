import express from 'express';
import { signInUser, getUsers, getUsersInEvent, putUser, verifyUser, loginUser, deleteUser, uploadProfilePicture } from "../controllers/user.js"
import { verifyToken } from '../middlewares/verification.js';
import { upload } from '../services/images.js';

const router = express.Router()

router.get('/', verifyToken, getUsers);
router.get('/:id_evento', verifyToken, getUsersInEvent);
router.put('/', verifyToken, putUser);
router.delete('/:id_usuario', verifyToken, deleteUser);

// Account management
router.get('/login', verifyToken, loginUser);
router.post('/signin', signInUser);
router.post('/verify', verifyUser);

// Upload profile picture
router.post('/image', verifyToken, upload.single('profile'), uploadProfilePicture);

export default router;