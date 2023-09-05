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
async function deleteEvento(idEvento){
    var res;

    if(idUsuario){
        res= await client.query(
            'DELETE FROM eventos WHERE id_evento = (?);',[idEvento]
        )
    }
    return[];
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
    }
    
    return res[0];
}

export { selectEventos, insertEvento, deleteEvento };