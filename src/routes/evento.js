import express from 'express';
import { getEventos, postEvento, deleteEvento} from '../controllers/evento.js';
import { verifyToken } from '../middlewares/verification.js';


const router = express.Router()

router.get('/', verifyToken, getEventos);
router.post('/', verifyToken, postEvento);
router.delete('/:id_evento', verifyToken, deleteEvento);
export default router;