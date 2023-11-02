import { selectTransaction, selectTransactions, insertTransaction, removeTransaction, updateTransaction } from '../services/transaction.js';
import { postError, putError, deleteError, validationError, authenticationError, getError, uploadError } from '../utils/strings.js';

async function getTransaction(req, res, next) {
    if (req.user) {
        try {
            const idTransaction = req.params.id_transaction;
            const userId = req.user.id_usuario;
            
            if (!idTransaction) {
                res.status(400);
                res.json({ error: validationError });
            }

            const transactions = await selectTransaction(userId, idTransaction);
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
            const idInsumo = req.params.id_insumo;
            const userId = req.user.id_usuario;
            
            if (!idInsumo) {
                res.status(400);
                res.json({ error: validationError });
            }

            const transactions = await selectTransactions(userId, idInsumo);
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
            const idTransaction = req.params.id_transaction;
            const userId = req.user.id_usuario;

            console.log("Remover transação " + idTransaction + " com usuário " + userId);
            
            const result = await removeTransaction(userId, idTransaction);
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
            const { idTransaction, valor, data, novouserId } = req.body;
            const userId = req.user.id_usuario;

            if (!idTransaction || !valor || !data || !novouserId) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Editar transação " + nome);
            const transaction = await updateTransaction(userId, idTransaction, valor, data, novouserId);

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
            const { valor, data, idInsumo, novouserId } = req.body;
            const userId = req.user.id_usuario;

            if (!valor || !data || !novouserId) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar transação " + nome);
            const transaction = await insertTransaction(userId, valor, data, idInsumo, novouserId);

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