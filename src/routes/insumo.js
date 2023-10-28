import express from 'express';
import { getItems, postItem, putItem, deleteItem } from '../controllers/insumo.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:id_evento', verifyToken, getItems);
router.post('/', verifyToken, postItem);
router.put('/', verifyToken, putItem);
router.delete('/:id_insumo', verifyToken, deleteItem);

export default router;