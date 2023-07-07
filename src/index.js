require("dotenv").config();
 
const express = require('express');
const app = express();
const port = process.env.PORT;

app.use(express.json());
 
app.get('/', (req, res) => res.json({ message: 'Funcionando!' }));

app.listen(port);
console.log('API funcionando!');

const mysql = require('mysql2/promise');
 
const client = mysql.createPool(process.env.DATABASE);

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