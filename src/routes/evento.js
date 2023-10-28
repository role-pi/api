import express from 'express';
import { getEvents, postEvent,putEvent, deleteEvent} from '../controllers/evento.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:id_evento?', verifyToken, getEvents);
router.post('/', verifyToken, postEvent);
router.put('/', verifyToken, putEvent);
router.delete('/:id_evento', verifyToken, deleteEvent);

export default router;