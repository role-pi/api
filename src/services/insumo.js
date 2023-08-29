import client from '../utils/database.js';

async function selectInsumos(idEvento) {
    var res;

    if (idEvento) {
        res = await client.query(`
            SELECT *
            FROM insumos
            WHERE eventos_id_evento = ?
        `, [idEvento]);

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
    
    return [res2[0], res1[0]];
}

export { selectInsumos, insertInsumo }