import client from '../utils/database.js';

async function selectUsuarios(idEvento) {
    var query;
    
    if (!idEvento) {
        query = await client.query('SELECT * FROM usuarios');
    } else {
        query = await client.query(`
        SELECT usuarios.* FROM usuarios
        INNER JOIN eventos_has_usuarios
        ON usuarios.id_usuario = eventos_has_usuarios.usuarios_id_usuario
        WHERE eventos_has_usuarios.eventos_id_evento = ?
        `, [idEvento]);
    }
    
    return query[0];
}

async function selectUsuario(email) {
    var query = await client.query(`
    SELECT * FROM usuarios WHERE email = ?
    `, [email]);
    if (!query[0].length) return null;
    return query[0][0]
}

async function insertUsuario(email) {
    var query = await client.query(`
    INSERT INTO usuarios (email) VALUES (?)
    `, [email]);
    return query[0].insertId;
}

async function updateUsuario(idUsuario, nome, email) {
    var query = await client.query(`
    UPDATE usuarios SET nome = ?, email = ? WHERE id_usuario = ?
    `, [nome, email, idUsuario]);
    return query[0].insertId;
}

async function updateProfilePictureURL(idUsuario, url) {
    var query = await client.query(`
    UPDATE usuarios SET foto_de_perfil_url = ? WHERE id_usuario = ?
    `, [url, idUsuario]);
    return query[0].insertId;
}

async function removeUsuario(idUsuario) {
    var query = await client.query(`
    DELETE FROM usuarios WHERE id_usuario = ?
    `, [idUsuario]);
    return query[0].insertId;
}

export { selectUsuarios, selectUsuario, insertUsuario, updateUsuario, updateProfilePictureURL, removeUsuario };