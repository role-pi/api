import express from 'express';
import { signInUser, getUsers, getUsersInEvent, putUser, verifyUser, loginUser, deleteUser, uploadProfilePicture } from "../controllers/user.js"
import { makeReport } from '../controllers/report.js';
import { verifyToken } from '../middlewares/verification.js';
import { upload } from '../services/images.js';

const router = express.Router()

// Account management
router.get('/login', verifyToken, loginUser);
router.get('/report', verifyToken, makeReport);
router.post('/signin', signInUser);
router.post('/verify', verifyUser);

router.get('/', verifyToken, getUsers);
router.get('/:event_id', verifyToken, getUsersInEvent);
router.put('/', verifyToken, putUser);
router.delete('/:user_id', verifyToken, deleteUser);

// Upload profile picture
router.post('/image', verifyToken, upload.single('profile'), uploadProfilePicture);

export default router;