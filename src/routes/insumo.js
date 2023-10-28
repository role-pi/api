import express from 'express';
import { getInsumos, postInsumo, putInsumo, deleteInsumo } from '../controllers/insumo.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:id_evento', verifyToken, getInsumos);
router.post('/', verifyToken, postInsumo);
router.put('/', verifyToken, putInsumo);
router.delete('/:id_insumo', verifyToken, deleteInsumo);

export default router;