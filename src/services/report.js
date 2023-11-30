import client from '../utils/database.js';

async function generateReport(userId) {
    if (userId) {
        var res1 = await client.query(`
        SELECT
            SUM(transacoes.valor) AS total
        FROM
            usuarios
        JOIN
            transacoes ON transacoes.usuarios_id_usuario = usuarios.id_usuario
        WHERE
            usuarios.id_usuario = ?
        GROUP BY
            usuarios.id_usuario;
        `, [userId]);

        var res2 = await client.query(`
        SELECT
		    COUNT(eventos.id_evento) AS eventos
        FROM
            usuarios
        JOIN
            eventos_has_usuarios ON eventos_has_usuarios.usuarios_id_usuario = usuarios.id_usuario
        JOIN
            eventos ON eventos.id_evento = eventos_has_usuarios.eventos_id_evento
        WHERE
            usuarios.id_usuario = ?
        GROUP BY
            usuarios.id_usuario;
        `, [userId]);

        var res3 = await client.query(`
        SELECT
            insumos.tipo AS categoria
        FROM
            usuarios
        JOIN
            transacoes ON transacoes.usuarios_id_usuario = usuarios.id_usuario
        JOIN
            insumos ON transacoes.insumos_id_insumo = insumos.id_insumo
        WHERE
            usuarios.id_usuario = ?
        GROUP BY
            insumos.id_insumo;
        `, [userId]);

        return {total: res1[0], eventos: res2[0], insumos: res3[0]};
    }
}

export { generateReport };