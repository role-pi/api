import client from '../utils/database.js';

async function selectTransaction(userId, idTransaction) {
    if (idTransaction) {
        var res = await client.query(`
            SELECT transacoes.*, usuarios.*
            FROM transacoes
            INNER JOIN usuarios ON usuarios.id_usuario = transacoes.id_usuario
            WHERE transacoes.id_transacao = ?
        `, [idTransaction]);

        if (res) {
            return res[0];
        }
    }
    
    return [];
}

async function selectTransactions(userId, idInsumo) {
    if (idInsumo) {
        var res = await client.query(`
            SELECT transacoes.*, usuarios.*
            FROM transacoes
            INNER JOIN usuarios ON usuarios.id_usuario = transacoes.usuarios_id_usuario
            WHERE transacoes.insumos_id_insumo = ?
        `, [idInsumo]);
        if (res) {
            return res[0];
        }
    }
    
    return [];
}

async function insertTransaction(userId, valor, data, idInsumo, novouserId) {
    if (valor, data, novouserId) {
        var res = await client.query(`
            INSERT INTO transacoes (valor, data, id_insumo, id_usuario) VALUES (?, ?, ?, ?)
        `, [valor, data, idInsumo, novouserId]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function updateTransaction(idTransaction, valor, data, novouserId) {
    if (idTransaction) {
        var res = await client.query(`
            UPDATE transcoes SET valor = ?, data = ?, id_usuario = ? WHERE id_transacao = ?
        `, [valor, data, novouserId, idTransaction]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function removeTransaction(userId, idTransaction){
    var res;

    if (idTransaction) {
        res = await client.query(`
            DELETE FROM transacoes WHERE id_transacao = ?
        `, [idTransaction])
    }

    if (res) {
        return res[0];
    }

    return null;
}

export { selectTransaction, selectTransactions, insertTransaction, updateTransaction, removeTransaction };