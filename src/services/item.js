import client from '../utils/database.js';

async function selectItem(userId, itemId) {
    var res;

    if (userId, itemId) {
        res = await client.query(`
            SELECT *
            FROM insumos
            WHERE id_insumo = ?
        `, [itemId]);

        return res[0];
    }
    
    return [];
}

async function selectItems(userId, eventId) {
    var res;

    if (userId, eventId) {
        res = await client.query(`
            SELECT insumos.*,
            IFNULL(SUM(transacoes.valor), 0) AS valor_total,
            MAX(transacoes.data) as data
            FROM insumos
            INNER JOIN eventos_has_usuarios ON insumos.eventos_id_evento = eventos_has_usuarios.eventos_id_evento
            LEFT JOIN transacoes ON insumos.id_insumo = transacoes.insumos_id_insumo
            WHERE eventos_has_usuarios.usuarios_id_usuario = ? AND
            insumos.eventos_id_evento = ?
            GROUP BY insumos.id_insumo
            ORDER BY data DESC
        `, [userId, eventId]);

        return res[0];
    }
    
    return [];
}

async function insertItem(userId, eventId, category, name, notes, amount) {
    if (userId, eventId, category, name, notes, amount) {
        var res1 = await client.query(`
            INSERT INTO insumos (tipo, nome, notas, eventos_id_evento) VALUES (?, ?, ?, ?)
        `, [category, name, notes, eventId]);
        
        if (!res1) {
            return null;
        }

        var res2 = await client.query(`
            INSERT INTO transacoes (valor, data, usuarios_id_usuario, insumos_id_insumo) VALUES (?, ?, ?, ?)
        `, [amount, new Date().toISOString().slice(0, 19).replace("T", " "), userId, res1[0].insertId]);

        if (res2) {
            return [res1[0], res2[0]];
        }
    }
    
    return null;
}

async function updateItem(userId, itemId, category, name, notes) {
    if (userId, itemId, category, name, notes) {
        var res = await client.query(`
            UPDATE insumos SET tipo = ?, nome = ?, notas = ? WHERE id_insumo = ?
        `, [category, name, notes, itemId]);
        
        if (res) {
            return res[0];
        }
    }

    return null;
}

async function removeItem(userId, itemId) {
    var res;

    if (userId, itemId) {
        res = await client.query(`
            DELETE FROM insumos WHERE id_insumo = ?
        `, [itemId]);
    }

    if (res) {
        return res[0];
    }

    return null;
}

export { selectItem, selectItems, insertItem, updateItem, removeItem }