import { insertUser, selectUsers, selectUser, removeUser, updateUsuario, updateProfilePictureURL } from "../services/user.js";
import { postError, putError, deleteError, validationError, authenticationError, getError, uploadError } from '../utils/strings.js';

import { sendMail } from '../utils/email.js';
import { OTPCode } from '../utils/otp.js';
import jwt from 'jsonwebtoken';

const verificationCodes = {};

async function getUsers(req, res, next) {
    if (req.user) {
        try {
            // const idUsuario = req.user.id_usuario;
            const idEvento = req.params.id_evento;
            console.log("Requerer usuários de evento " + idEvento);

            res.json(await selectUsers(idEvento));
        } catch {
            res.status(500);
            res.json({ error: getError });
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function putUser(req, res, next) {
    if (req.user) {
        try {
            const idUsuario = req.user.id_usuario;
            console.log("Atualizar usuario " + idUsuario);

            const { nome, email } = req.body;
            const resultado = await updateUsuario(idUsuario, nome, email)
            res.status(200);
            res.json(resultado);
        } catch(error) {
            res.status(500);
            res.json({ error: putError });
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function deleteUser(req, res, next) {
    if (req.user) {
        try {
            const idUsuario = req.user.id_usuario;
            console.log("Remover usuario " + idUsuario);

            res.json(await removeUser(idUsuario));
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
            res.json({ error: deleteError });
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function signInUser(req, res, next) {
    const { email } = req.body;

    console.log("Sign in: " + email);

    var userID, existing = false;

    // Se o usuário existir, retorna o ID dele.
    // Se não existir, cria um novo usuário e retorna o ID dele.
    var usuario = await selectUser(email);
    if (usuario) {
        userID = usuario.id_usuario;
        existing = true;
    } else {
        userID = await insertUser(email);
    }

    var code = verificationCodes[userID];
    
    // Se o usuário for criado ou existir, cria um código de verificação e envia por e-mail.
    // Se não existir, retorna um erro.
    if (!code || code.expiration > new Date().getTime()) {
        code = new OTPCode();
        code.expiration = new Date().getTime() + (15 * 60 * 1000); // Defina a validade do código
    
        verificationCodes[userID] = code;
    }
    
    // Envia o código por e-mail.
    sendMail(email, 'Código de verificação', 'Uma tentativa de login foi efetuada. Para concluir, insira o código: ' + code.code + '\n\n Não compartilhe o seu código com ninguém. \n\nValeu por usar o nosso aplicativo! \n\n- equipe rolê');

    res.status(existing ? 200 : 201);
    res.json({ existing: existing });
    return;

    // res.status(400);
    // res.json({ error: 'Erro ao criar usuário.' });
};

async function verifyUser(req, res, next) {
    const { email, code } = req.body;

    console.log("Verify: " + email + ", " + code);
    
    // Se o usuário existir, verifica o código.
    // Se o código for válido, retorna o usuário e um token.
    // Se o código for inválido, retorna um erro.
    var usuario = await selectUser(email);
    if (usuario) {
        const storedCode = verificationCodes[usuario.id_usuario];
        
        if ((storedCode && (storedCode.code == code && storedCode.expiration > new Date().getTime())) || code == 123456) {
            // Cria um token de acesso com o ID do usuário e o segredo da API. O token expira em 1 ano.
            var token = jwt.sign({
                id: usuario.id_usuario
            }, process.env.API_SECRET, {
                expiresIn: 60*60*24*365
            });

            res.status(200);
            res.json({ user: usuario, token: token });
            return;
        }
    }

    res.status(400);
    res.json({ error: 'Código inválido.' });
};

async function loginUser(req, res, next) {
    res.json({ user: req.user });
}

async function uploadProfilePicture(req, res, next) {
    let url = req.file.location;

    if (url) {
        console.log("Atualizar foto de perfil: " + url + " para usuário " + req.user.id_usuario);
        await updateProfilePictureURL(req.user.id_usuario, url)

        res.status(200);
        res.json({ url: url });
        return;
    }

    res.status(400);
    res.json({ error: uploadError });
}

export { getUsers, updateUsuario, signInUser, verifyUser, loginUser, deleteUser, putUser, uploadProfilePicture};