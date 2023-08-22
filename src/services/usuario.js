import client from '../utils/database.js';

async function addUsuario(email) {
    var query = await client.query(`
    INSERT INTO usuarios (email) VALUES (?)
    `, [email]);
    return query[0].insertId;
}

async function selectUsuarios(idEvento) {
    var res;
    
    if (!idEvento) {
        res = await client.query('SELECT * FROM usuarios');
    } else {
        res = await client.query(`
        SELECT usuarios.* FROM usuarios
        INNER JOIN eventos_has_usuarios
        ON usuarios.id_usuario = eventos_has_usuarios.usuarios_id_usuario
        WHERE eventos_has_usuarios.eventos_id_evento = ?
        `, [idEvento]);
    }
    
    return res[0];
}