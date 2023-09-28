import client from '../utils/database.js';

async function selectInsumos(idUsuario, idEvento) {
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

async function insertInsumo(idUsuario, idEvento, tipo, nome, descricao, valor) {
    var res1, res2;

    if (idUsuario, idEvento) {
        res1 = await client.query(`
            INSERT INTO insumos (tipo, nome, descricao, eventos_id_evento) VALUES (?, ?, ?, ?)
        `, [tipo, nome, descricao, idEvento]);
        
        if (!res1) {
            return null;
        }

        res2 = await client.query(`
            INSERT INTO transacoes (valor, data, usuarios_id_usuario, insumos_id_insumo) VALUES (?, ?, ?, ?)
        `, [valor, new Date().toISOString().slice(0, 19).replace("T", " "), idUsuario, res1[0].insertId]);
    }
    
    return [res1[0], res2[0]];
}

export { selectInsumos, insertInsumo }