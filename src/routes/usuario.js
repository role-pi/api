import express from 'express';
import client from '../db.js';

import { signInUsuario, getUsuarios, verifyUsuario } from "../controllers/usuario.js"

const router = express.Router()

router.get('/', verifyToken, getUsuarios);
router.post('/signin', signInUsuario);
router.post('/verify', verifyUsuario);

router.post('/login', verifyToken, async(req, res) => {
    const { email } = req.body;
    res.json({ email: email, user: req.user });
});

export default router;