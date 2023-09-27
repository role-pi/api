import client from '../utils/database.js';

async function selectEventos(idUsuario) {
    var res;

    if (idUsuario) {
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

        return res[0];
    }
    
    return [];
}

async function selectEvento(idUsuario, idEvento) {
    var res;

    if (idUsuario) {
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
        `, [idUsuario, idEvento]);

        if (!query[0].length) return null;
        return query[0][0]
    }
    
    return null;
}

async function insertEvento(idUsuario, nome, emoji, cor1, cor2) {
    var res;

    if (idUsuario) {
        res = await client.query(`
            INSERT INTO eventos (nome, emoji, cor_1, cor_2) VALUES (?, ?, ?, ?)
        `, [nome, emoji, cor1, cor2]);

        if (!res) {
            return null;
        }

        await client.query(`
            INSERT INTO eventos_has_usuarios (eventos_id_evento, usuarios_id_usuario) VALUES (?, ?)
        `, [res[0].insertId, idUsuario]);
        return res[0];
    }
    
    return null;
}

async function updateEvento(idEvento, nome, emoji, cor1, cor2, dataInicio, dataFim) {
    var res;

    if (idEvento) {
        if (dataInicio && dataFim) {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_inicio = ?, data_fim = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, dataInicio, dataFim, idEvento]);
        } else if (dataInicio) {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_inicio = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, dataInicio, idEvento]);
        }  else if (dataFim) {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ?, data_fim = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, dataFim, idEvento]);
        } else {
            res = await client.query(`
                UPDATE eventos SET nome = ?, emoji = ?, cor_1 = ?, cor_2 = ? WHERE id_evento = ?
            `, [nome, emoji, cor1, cor2, idEvento]);
        }

        return res[0];
    }
    
    return null;
}

async function removeEvento(idUsuario, idEvento){
    var res;

    if (idUsuario) {
        res = await client.query(`
            DELETE eventos
            FROM eventos
            INNER JOIN eventos_has_usuarios ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
            WHERE eventos.id_evento = ?
            AND eventos_has_usuarios.usuarios_id_usuario = ?;
        `, [idEvento, idUsuario])
    }

    return res;
}

export { selectEventos, selectEvento, insertEvento, updateEvento, removeEvento };