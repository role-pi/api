import client from '../utils/database.js';

async function selectUsers(query, eventId) {
    var query;

    query = await client.query(`
    SELECT usuarios.*,
    CASE
        WHEN eventos_has_usuarios.usuarios_id_usuario IS NOT NULL THEN 1
        ELSE 0
        END AS participante
    FROM usuarios
    LEFT JOIN eventos_has_usuarios
    ON usuarios.id_usuario = eventos_has_usuarios.usuarios_id_usuario AND eventos_has_usuarios.eventos_id_evento = ?
    WHERE
        nome COLLATE utf8mb4_general_ci 
        LIKE CONCAT('%', ? ,'%')
        OR
        email COLLATE utf8mb4_general_ci 
        LIKE CONCAT('%', ? ,'%');
    `, [eventId, query, query]);

    return query[0];
}

async function selectUsersByEventId(eventId) {
    var query;
    
    if (!eventId) {
        query = await client.query('SELECT * FROM usuarios');
    } else {
        query = await client.query(`
        SELECT usuarios.* FROM usuarios
        INNER JOIN eventos_has_usuarios
        ON usuarios.id_usuario = eventos_has_usuarios.usuarios_id_usuario
        WHERE eventos_has_usuarios.eventos_id_evento = ?
        `, [eventId]);
    }
    
    return query[0];
}

async function selectUser(email) {
    var query = await client.query(`
    SELECT * FROM usuarios WHERE email = ?
    `, [email]);
    if (!query[0].length) return null;
    return query[0][0]
}

async function insertUser(email) {
    var query = await client.query(`
    INSERT INTO usuarios (email) VALUES (?)
    `, [email]);
    return query[0].insertId;
}

async function updateUsuario(userId, name, email) {
    var query = await client.query(`
    UPDATE usuarios SET nome = ?, email = ? WHERE id_usuario = ?
    `, [name, email, userId]);
    return query[0].insertId;
}

async function updateProfilePictureURL(userId, url) {
    var query = await client.query(`
    UPDATE usuarios SET foto_de_perfil_url = ? WHERE id_usuario = ?
    `, [url, userId]);
    return query[0].insertId;
}

async function removeUser(userId) {
    var query = await client.query(`
    DELETE FROM usuarios WHERE id_usuario = ?
    `, [userId]);

    if (res) {
        return res[0];
    }

    return null;
}

export { selectUsers, selectUsersByEventId, selectUser, insertUser, updateUsuario, updateProfilePictureURL, removeUser };