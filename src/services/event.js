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

async function insertEvent(userId, name, emoji, color1, color2) {
    var res;

    if (userId) {
        res = await client.query(`
            INSERT INTO eventos (nome, emoji, cor_1, cor_2) VALUES (?, ?, ?, ?)
        `, [name, emoji, color1, color2]);

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

async function updateEvent(eventId, name, emoji, color1, color2, startDate, endDate, location_lat, location_lng, location_description) {
    var res;

    if (eventId) {
        startDate = startDate || null;
        endDate = endDate || null;
        var location_point = null;

        if (location_lat && location_lng) {
            location_point = `POINT(${location_lat}, ${location_lng})`;
        }

        res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_inicio = ?, data_fim = ?, location = ${location_point}, location_description = ? WHERE id_evento = ?
            `, [name, emoji, color1, color2, startDate, endDate, location_description, eventId]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function updateUsers(userId, eventId, addUsers, removeUsers) {
    let addedCount = 0;
    let removedCount = 0;

    if (eventId, addUsers, removeUsers) {
        if (addUsers.length > 0) {
            const addValues = addUsers.map(userId => `(${eventId}, ${userId})`).join(',');
            const addQuery = `
                INSERT IGNORE INTO eventos_has_usuarios (eventos_id_evento, usuarios_id_usuario) VALUES ${addValues}
            `;
            const addResult = await client.query(addQuery);

            if (addResult && addResult[0]) {
                addedCount = addResult.affectedRows || 0;
            }
        }


        if (removeUsers.length > 0) {
            const removeValues = removeUsers.map(userId => `(${eventId}, ${userId})`).join(',');
            const removeQuery = `
                DELETE FROM eventos_has_usuarios WHERE (eventos_id_evento, usuarios_id_usuario) IN (${removeValues})
            `;
            const removeResult = await client.query(removeQuery);

            if (removeResult && removeResult[0]) {
                removedCount = removeResult.affectedRows || 0;
            }
        }
    }

    return [ addedCount, removedCount ];
}

async function removeEvent(userId, eventId){
    var res;

    if (userId) {
        res = await client.query(`
            DELETE eventos
            FROM eventos
            INNER JOIN eventos_has_usuarios ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            WHERE eventos_has_usuarios.usuarios_id_usuario = ?
            AND eventos.id_evento = ?;
        `, [userId, eventId])
    }

    if (res) {
        return res[0];
    }

    return null;
}

export { selectEvents, selectEvent, insertEvent, updateEvent, updateUsers, removeEvent };