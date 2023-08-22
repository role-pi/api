import { insertUsuario, selectUsuarios, selectUsuario } from "../services/usuario.js";

import { OTPCode } from '../utils/otp.js';
import jwt from 'jsonwebtoken';

import { sendMail } from '../utils/email.js';

const verificationCodes = {};

async function getUsuarios(idEvento) {
    return selectUsuarios(idEvento);
}

async function signInUsuario(req, res, next) {
    const { email } = req.body;

    console.log("Sign in: " + email);

    var userID, existing;

    // Se o usuário existir, retorna o ID dele.
    // Se não existir, cria um novo usuário e retorna o ID dele.
    var usuario = selectUsuario(email);
    if (query[0].length) {
        userID = query[0][0].id_usuario;
        existing = true;
    } else {
        userID = await insertUsuario(email);
    }
    
    // Se o usuário for criado ou existir, cria um código de verificação e envia por e-mail.
    // Se não existir, retorna um erro.
    if (userID) {
        const code = new OTPCode();
        verificationCodes[userID] = code;

        // Envia o código por e-mail.
        sendMail(email, 'Código de verificação', 'Seu código de verificação é: ' + code.code);
        
        res.status(existing ? 200 : 201);
        res.json({ code: code.code, existing: existing });
        return;
    }

    res.status(400);
    res.json({ error: 'Erro ao criar usuário.' });
};

async function verifyUsuario(req, res, next) {
    const { email, code } = req.body;

    console.log("Verify: " + email + ", " + code);
    
    // Se o usuário existir, verifica o código.
    // Se o código for válido, retorna o usuário e um token.
    // Se o código for inválido, retorna um erro.
    var usuario = selectUsuario(email);
    if (usuario.length) {
        const user = query[0][0];
        const storedCode = verificationCodes[user.id_usuario];
        
        if (storedCode.code == code && storedCode.expiration > new Date().getTime()) {
            var token = jwt.sign({
                id: user.id_usuario
            }, process.env.API_SECRET, {
                expiresIn: 60*60*24*365
            });

            res.status(200)
            res.json({ user: user, token: token });
            return;
        }
    }

    res.status(400);
    res.json({ error: 'Código inválido.' });
};

async function loginUsuario() {
    const { email } = req.body;
    res.json({ email: email, user: req.user });
}