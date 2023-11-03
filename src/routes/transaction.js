import express from 'express';
import { getTransaction, postTransaction, putTransaction, deleteTransaction } from '../controllers/transaction.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:transaction_id', verifyToken, getTransaction);
router.post('/', verifyToken, postTransaction);
router.put('/', verifyToken, putTransaction);
router.delete('/:transaction_id', verifyToken, deleteTransaction);

export default router;