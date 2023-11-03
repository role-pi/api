import express from 'express';
import { getItem, postItem, putItem, deleteItem } from '../controllers/item.js';
import { getTransactions } from '../controllers/transaction.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:item_id', verifyToken, getItem);
router.get('/:item_id/transactions', verifyToken, getTransactions);
router.post('/', verifyToken, postItem);
router.put('/', verifyToken, putItem);
router.delete('/:item_id', verifyToken, deleteItem);

export default router;