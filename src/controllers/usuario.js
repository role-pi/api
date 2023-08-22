import { addUsuario, selectUsuarios, selectUsuario } from "../services/usuario.js";

import { verifyToken } from '../middlewares/verification.js';
import { OTPCode } from '../utils/otp.js';
import jwt from 'jsonwebtoken';

import { sendMail } from '../utils/email.js';

// Temporário
import client from '../utils/database.js';

const verificationCodes = {};

async function signInUsuario (req, res, next) {
    const { email } = req.body;

    console.log("Sign in: " + email);

    var userID, existing;
    var usuario = selectUsuario(email);
    
    if (query[0].length) {
        userID = query[0][0].id_usuario;
        existing = true;
    } else {
        userID = await addUsuario(email);
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
};

async function verifyUsuario(req, res, next) {
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
                expiresIn: 60*60*24*365
            });

            res.statusCode = 200;
            res.json({ user: user, token: token });
        } else {
            res.statusCode = 400;
            res.json({ error: 'Código inválido.' });
        }
    }
};

async function getUsuarios(idEvento) {
    return selectUsuarios(idEvento);
}