import { selectTransaction, selectTransactions, insertTransaction, removeTransaction, updateTransaction } from '../services/transaction.js';
import { postError, putError, deleteError, validationError, authenticationError, getError, uploadError } from '../utils/strings.js';

async function getTransaction(req, res, next) {
    if (req.user) {
        try {
            const transactionId = req.params.transaction_id;
            const userId = req.user.id_usuario;
            
            if (!transactionId) {
                res.status(400);
                res.json({ error: validationError });
            }

            const transactions = await selectTransaction(userId, transactionId);
            res.json(transactions);
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
            res.json({ error: getError });
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function getTransactions(req, res, next) {
    if (req.user) {
        try {
            const itemId = req.params.item_id;
            const userId = req.user.id_usuario;
            
            if (!itemId) {
                res.status(400);
                res.json({ error: validationError });
            }

            const transactions = await selectTransactions(userId, itemId);
            res.json(transactions);
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function deleteTransaction(req, res, next) {
    if (req.user) {
        try {
            const transactionId = req.params.transaction_id;
            const userId = req.user.id_usuario;

            console.log("Remover transação " + transactionId + " com usuário " + userId);
            
            const result = await removeTransaction(userId, transactionId);
            res.status(200);
            res.json(result);
            return;
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: deleteError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function putTransaction(req, res, next) {
    if (req.user) {
        try {
            const { transactionId, amount, date, newUserId } = req.body;
            const userId = req.user.id_usuario;

            if (!transactionId || !amount || !date || !newUserId) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Editar transação " + transactionId);
            const transaction = await updateTransaction(userId, transactionId, amount, date, newUserId);

            if (transaction) {
                res.json(transaction);
                return;
            }
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: putError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function postTransaction(req, res, next) {
    if (req.user) {
        try {
            const { amount, date, itemId, newUserId } = req.body;
            const userId = req.user.id_usuario;

            if (!amount || !date || !newUserId) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar transação " + itemId);
            const transaction = await insertTransaction(userId, amount, date, itemId, newUserId);

            if (transaction) {
                res.json(transaction);
                return;
            }
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: postError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

export { getTransaction, getTransactions, postTransaction, putTransaction, deleteTransaction };