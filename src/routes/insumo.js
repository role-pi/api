import express from 'express';
import { getInsumos, postInsumo } from '../controllers/insumo.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:id_evento', verifyToken, getInsumos);
router.post('/', verifyToken, postInsumo);

export default router;