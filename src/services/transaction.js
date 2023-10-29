import client from '../utils/database.js';

async function selectTransaction(idUsuario, idTransaction) {
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

async function selectTransactions(idUsuario, idInsumo) {
    if (idInsumo) {
        var res = await client.query(`
            SELECT transacoes.*, usuarios.*
            FROM transacoes
            INNER JOIN usuarios ON usuarios.id_usuario = transacoes.id_usuario
            WHERE transacoes.id_insumo = ?
        `, [idInsumo]);

        if (res) {
            return res[0];
        }
    }
    
    return [];
}

async function insertTransaction(idUsuario, valor, data, idInsumo, novoIdUsuario) {
    if (valor, data, novoIdUsuario) {
        var res = await client.query(`
            INSERT INTO transacoes (valor, data, id_insumo, id_usuario) VALUES (?, ?, ?, ?)
        `, [valor, data, idInsumo, novoIdUsuario]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function updateTransaction(idTransaction, valor, data, novoIdUsuario) {
    if (idTransaction) {
        var res = await client.query(`
            UPDATE transcoes SET valor = ?, data = ?, id_usuario = ? WHERE id_transacao = ?
        `, [valor, data, novoIdUsuario, idTransaction]);

        if (res) {
            return res[0];
        }
    }
    
    return null;
}

async function removeTransaction(idUsuario, idTransaction){
    var res;

    if (idTransaction) {
        res = await client.query(`
            DELETE FROM transacoes WHERE id_transacao = ?
        `, [idTransaction])
    }

    return res;
}

export { selectTransaction, selectTransactions, insertTransaction, updateTransaction, removeTransaction };