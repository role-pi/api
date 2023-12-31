import client from '../utils/database.js';

async function selectTransaction(userId, transactionId) {
    if (transactionId) {
        var res = await client.query(`
            SELECT transacoes.*, usuarios.*
            FROM transacoes
            INNER JOIN usuarios ON usuarios.id_usuario = transacoes.id_usuario
            WHERE transacoes.id_transacao = ?
        `, [transactionId]);

        if (res) {
            return res[0];
        }
    }
    
    return [];
}

async function selectTransactions(userId, itemId) {
    if (itemId) {
        var res = await client.query(`
            SELECT transacoes.*, usuarios.*
            FROM transacoes
            INNER JOIN usuarios ON usuarios.id_usuario = transacoes.usuarios_id_usuario
            WHERE transacoes.insumos_id_insumo = ?
        `, [itemId]);
        if (res) {
            return res[0];
        }
    }
    
    return [];
}

async function insertTransaction(userId, amount, date, itemId, newUserId) {
    if (amount, date, itemId, newUserId) {
        var res = await client.query(`
            INSERT INTO transacoes (valor, data, usuarios_id_usuario, insumos_id_insumo) VALUES (?, ?, ?, ?)
        `, [amount, date, newUserId, itemId]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function updateTransaction(userId, transactionId, amount, date, newUserId) {
    if (transactionId, amount, date, newUserId) {
        var res = await client.query(`
            UPDATE transacoes SET valor = ?, data = ?, usuarios_id_usuario = ? WHERE id_transacao = ?
        `, [amount, date, newUserId, transactionId]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function removeTransaction(userId, transactionId){
    var res;

    if (transactionId) {
        res = await client.query(`
            DELETE FROM transacoes WHERE id_transacao = ?
        `, [transactionId])
    }

    if (res) {
        return res[0];
    }

    return null;
}

export { selectTransaction, selectTransactions, insertTransaction, updateTransaction, removeTransaction };