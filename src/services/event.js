import client from '../utils/database.js';

async function selectEvents(userId) {
    var res;

    if (userId) {
        res = await client.query(`
                SELECT eventos.*,
                IFNULL(SUM(transacoes.valor), 0) AS valor_total,
                usuarios.fotos_de_perfil AS fotos_de_perfil
            FROM eventos
            JOIN eventos_has_usuarios ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            LEFT JOIN insumos ON eventos.id_evento = insumos.eventos_id_evento
            LEFT JOIN transacoes ON insumos.id_insumo = transacoes.insumos_id_insumo
            LEFT JOIN (
                SELECT eventos_has_usuarios.eventos_id_evento, GROUP_CONCAT(usuarios.foto_de_perfil_url) AS fotos_de_perfil
                FROM eventos_has_usuarios
                JOIN usuarios ON eventos_has_usuarios.usuarios_id_usuario = usuarios.id_usuario
                GROUP BY eventos_has_usuarios.eventos_id_evento
            ) usuarios ON eventos.id_evento = usuarios.eventos_id_evento
            WHERE eventos.id_evento IN (
                SELECT eventos_id_evento
                FROM eventos_has_usuarios
                WHERE eventos_has_usuarios.usuarios_id_usuario = ?
            )
            GROUP BY eventos.id_evento
        `, [userId]);

        return res[0];
    }
    
    return [];
}

async function selectEvent(userId, eventId) {
    var res;

    if (userId) {
        res = await client.query(`
            SELECT eventos.*, IFNULL(SUM(transacoes.valor), 0) AS valor_total
            FROM eventos
            INNER JOIN eventos_has_usuarios
            ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            LEFT JOIN insumos
            ON eventos.id_evento = insumos.eventos_id_evento
            LEFT JOIN transacoes
            ON insumos.id_insumo = transacoes.insumos_id_insumo
            WHERE eventos_has_usuarios.usuarios_id_usuario = ? AND
            eventos.id_evento = ?
            GROUP BY eventos.id_evento
        `, [userId, eventId]);

        if (!res[0].length) return null;
        return res[0][0];
    }
    
    return null;
}

async function insertEvent(userId, nome, emoji, cor1, cor2) {
    var res;

    if (userId) {
        res = await client.query(`
            INSERT INTO eventos (nome, emoji, cor_1, cor_2) VALUES (?, ?, ?, ?)
        `, [nome, emoji, cor1, cor2]);

        if (!res) {
            return null;
        }

        await client.query(`
            INSERT INTO eventos_has_usuarios (eventos_id_evento, usuarios_id_usuario) VALUES (?, ?)
        `, [res[0].insertId, userId]);
        return res[0];
    }
    
    return null;
}

async function updateEvent(eventId, nome, emoji, cor1, cor2, dataInicio, dataFim) {
    var res;

    if (eventId) {
        if (dataInicio && dataFim) {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_inicio = ?, data_fim = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, dataInicio, dataFim, eventId]);
        } else if (dataInicio) {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_inicio = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, dataInicio, eventId]);
        }  else if (dataFim) {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_fim = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, dataFim, eventId]);
        } else {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, eventId]);
        }

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function removeEvent(userId, eventId){
    var res;

    if (userId) {
        res = await client.query(`
            DELETE eventos
            FROM eventos
            INNER JOIN eventos_has_usuarios ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            WHERE eventos.id_evento = ?
            AND eventos_has_usuarios.usuarios_id_usuario = ?;
        `, [eventId, userId])
    }

    if (res) {
        return res[0];
    }

    return null;
}

export { selectEvents, selectEvent, insertEvent, updateEvent, removeEvent };