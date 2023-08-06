import VerificationCode from './verification.js';
import dotenv from 'dotenv';
import express from 'express';
import mysql from 'mysql2/promise';
import jwt from 'jsonwebtoken';

dotenv.config()

// var admin = require("firebase-admin");
// var serviceAccount = require("./key.json");
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));
 
app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

app.listen(port);
console.log('API funcionando em '+port);
 
const client = mysql.createPool(process.env.MYSQL_URL);

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

async function selectEventos(idUsuario) {
    var res;

    if (!idUsuario) {
        res = await client.query('SELECT * FROM eventos');
    } else {
        res = await client.query(`
            SELECT eventos.* FROM eventos
            INNER JOIN eventos_has_usuarios
            ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            WHERE eventos_has_usuarios.usuarios_id_usuario = ?
        `, [idUsuario]);
    }
    
    return res[0];
}

app.get('/', (req, res) => res.json({ message: 'A API está funcionando.' }));

app.get('/usuarios', async (req, res) => {
    const usuarios = await selectUsuarios(req.query.id_evento);
    res.json(usuarios);
});

app.get('/eventos', async (req, res) => {
    const eventos = await selectEventos(req.query.id_usuario);
    res.json(eventos);
});

const verificationCodes = {};

app.post('/signiup', async(req, res) => {
    const { email } = req.body;

    var query = await client.query(`
        SELECT * FROM usuarios WHERE email = ?
    `, [email]);

    if (query[0].length) {
        res.json({ error: "Usuário já existe." });
        return;
    }

    var query = await client.query(`
        INSERT INTO usuarios (email) VALUES (?)
    `, [email]);

    console.log(query);

    if (query[0].insertId) {
        const code = new VerificationCode();
        verificationCodes[query[0].insertId] = code;

        res.json({ code: code.code });
    } else {
        res.json({ error: 'Erro ao criar usuário.' });
    }
});

const verifyToken = (req, res, next) => {
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'JWT') {
      jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
        if (err) req.user = undefined;
        var query = client.query(`
            SELECT * FROM usuarios WHERE id_usuario = ?
        `, [decode.id]).then((query) => {
        
            console.log(query);

            if (query[0].length) {
                const user = query[0][0];
                req.user = user;
                next();
            } else {
                req.user = undefined;
                next();
            }
        });
      });
    } else {
      req.user = undefined;
      next();
    }
  };

app.post('/login', verifyToken, async(req, res) => {
    const { email } = req.body;
    res.json({ email: email, user: req.user });
});

app.post('/verify', async(req, res) => {
    const { email, code } = req.body;

    var query = await client.query(`
        SELECT * FROM usuarios WHERE email = ?
    `, [email]);

    if (query[0].length) {
        const user = query[0][0];

        // if (verificationCodes[user.id_usuario].code == code) {
        if (10 == code) {

            var token = jwt.sign({
                id: user.id_usuario
            }, process.env.API_SECRET, {
                expiresIn: 86400
            });
            res.json({ user: user, token: token });
        } else {
            res.json({ error: 'Código inválido.' });
        }
    }
});