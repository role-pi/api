import express from 'express';
import client from '../db.js';
import { verifyToken } from '../verification.js';

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

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    const eventos = await selectEventos(req.user.id_usuario);
    res.json(eventos);
});

export default router;