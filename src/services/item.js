import client from '../utils/database.js';

async function selectItems(idUsuario, idEvento) {
    var res;

    if (idEvento) {
        res = await client.query(`
            SELECT insumos.*
            FROM insumos
            INNER JOIN eventos_has_usuarios ON insumos.eventos_id_evento = eventos_has_usuarios.eventos_id_evento
            WHERE eventos_has_usuarios.usuarios_id_usuario = ? AND
            insumos.eventos_id_evento = ?
        `, [idUsuario, idEvento]);

        return res[0];
    }
    
    return [];
}

async function insertItem(idUsuario, idEvento, tipo, nome, descricao, valor) {
    if (idUsuario, idEvento, tipo, nome) {
        var res1 = await client.query(`
            INSERT INTO insumos (tipo, nome, descricao, eventos_id_evento) VALUES (?, ?, ?, ?)
        `, [tipo, nome, descricao, idEvento]);
        
        if (!res1) {
            return null;
        }

        var res2 = await client.query(`
            INSERT INTO transacoes (valor, data, usuarios_id_usuario, insumos_id_insumo) VALUES (?, ?, ?, ?)
        `, [valor, new Date().toISOString().slice(0, 19).replace("T", " "), idUsuario, res1[0].insertId]);

        if (res2) {
            return [res1[0], res2[0]];
        }
    }
    
    return null;
}

async function updateItem(idUsuario, idInsumo, tipo, nome, descricao) {
    if (idUsuario, idInsumo, tipo, nome, descricao) {
        var res = await client.query(`
            UPDATE insumos SET tipo = ?, nome = ?, descricao = ? WHERE id_insumo = ?
        `, [tipo, nome, descricao, idInsumo]);
        
        if (res) {
            return res[0];
        }
    }

    return null;
}

async function removeItem(idUsuario, idInsumo) {
    var res;

    if (idUsuario, idInsumo) {
        res = await client.query(`
            DELETE FROM insumos WHERE id_insumo = ?
        `, [idInsumo]);
    }

    return res;
}

export { selectItems, insertItem, updateItem, removeItem }