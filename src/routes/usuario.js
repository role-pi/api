import express from 'express';
import client from '../db.js';

import { OTPCode, verifyToken } from '../verification.js';
import jwt from 'jsonwebtoken';

import { sendMail } from '../email.js';

const router = express.Router()

const verificationCodes = {};

async function selectUsuarios(idEvento) {
    var res;
    
    if (!idEvento) {
        res = await client.query('SELECT * FROM usuarios');
    } else {
        res = await client.query(`
        SELECT usuarios.* FROM usuarios
        INNER JOIN eventos_has_usuarios
        ON usuarios.id_usuario = eventos_has_usuarios.usuarios_id_usuario
        WHERE eventos_has_usuarios.eventos_id_evento = ?
        `, [idEvento]);
    }
    
    return res[0];
}

router.get('/', verifyToken, async (req, res) => {
    const usuarios = await selectUsuarios(req.query.id_evento);
    res.json(usuarios);
});


router.post('/signin', async(req, res) => {
    const { email } = req.body;

    console.log("Sign in: " + email);

    var userID, existing;
    
    var query = await client.query(`
    SELECT * FROM usuarios WHERE email = ?
    `, [email]);
    
    if (query[0].length) {
        userID = query[0][0].id_usuario;
        existing = true;
    } else {
        console
        var query = await client.query(`
        INSERT INTO usuarios (email) VALUES (?)
        `, [email]);
        userID = query[0].insertId;
    }
    
    if (userID) {
        const code = new OTPCode();
        verificationCodes[userID] = code;

        sendMail(email, 'Código de verificação', 'Seu código de verificação é: ' + code.code);
        
        res.statusCode = existing ? 200 : 201;
        res.json({ code: code.code, existing: existing });
    } else {
        res.statusCode = 400;
        res.json({ error: 'Erro ao criar usuário.' });
    }
});

router.post('/login', verifyToken, async(req, res) => {
    const { email } = req.body;
    res.json({ email: email, user: req.user });
});

// Verificar código de verificação
router.post('/verify', async(req, res) => {
    const { email, code } = req.body;

    console.log("Verify: " + email + ", " + code);
    
    var query = await client.query(`
    SELECT * FROM usuarios WHERE email = ?
    `, [email]);
    
    if (query[0].length) {
        const user = query[0][0];
        const storedCode = verificationCodes[user.id_usuario];
        
        if (storedCode.code == code && storedCode.expiration > new Date().getTime()) {
            var token = jwt.sign({
                id: user.id_usuario
            }, process.env.API_SECRET, {
                expiresIn: 60*60*24*365 // expires in 1 year
            });

            res.statusCode = 200;
            res.json({ user: user, token: token });
        } else {
            res.statusCode = 400;
            res.json({ error: 'Código inválido.' });
        }
    }
});

export default router;