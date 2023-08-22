import express from 'express';
import client from '../db.js';
import { verifyToken } from '../verification.js';

async function selectEventos(idUsuario) {
    var res;

    if (!idUsuario) {
        res = await client.query('SELECT * FROM eventos');
    } else {
        res = await client.query(`
            SELECT eventos.*, IFNULL(SUM(transacoes.valor), 0) AS valor_total
            FROM eventos
            INNER JOIN eventos_has_usuarios
            ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            LEFT JOIN insumos
            ON eventos.id_evento = insumos.eventos_id_evento
            LEFT JOIN transacoes
            ON insumos.id_insumo = transacoes.insumos_id_insumo
            WHERE eventos_has_usuarios.usuarios_id_usuario = ?
            GROUP BY eventos.id_evento
        `, [idUsuario]);
    }
    
    return res[0];
}

async function addEvento(idUsuario, nome) {
    var res;

    if (idUsuario) {
        res = await client.query(`
            INSERT INTO eventos (nome) VALUES (?)
        `, [nome]);

        await client.query(`
            INSERT INTO eventos_has_usuarios (eventos_id_evento, usuarios_id_usuario) VALUES (?, ?)
        `, [res[0].insertId, idUsuario]);
    }
    
    return res[0];
}

const router = express.Router()

router.get('/', verifyToken, async (req, res) => {
    if (req.user) {
        const eventos = await selectEventos(req.user.id_usuario);
        console.log(eventos, req.user.id_usuario);
        res.json(eventos);
    } else {
        res.json( { error: "Houve um erro ao obter eventos." } );
    }
});

router.post('/', verifyToken, async (req, res) => {
    if (req.user) {
        const { nome } = req.body;

        console.log("Adicionar evento: " + nome);
        const evento = await addEvento(req.user.id_usuario, nome);

        res.json( { evento_id:  evento.insertId } );
    } else {
        res.json([]);
    }
});

export default router;