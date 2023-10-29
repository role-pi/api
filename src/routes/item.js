import express from 'express';
import { getItem, postItem, putItem, deleteItem } from '../controllers/item.js';
import { getTransactions } from '../controllers/transaction.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:id_insumo', verifyToken, getItem);
router.get('/:id_insumo/transacoes', verifyToken, getTransactions);
router.post('/', verifyToken, postItem);
router.put('/', verifyToken, putItem);
router.delete('/:id_insumo', verifyToken, deleteItem);

export default router;