import express from 'express';
import { getEvents, postEvent, putEvent, deleteEvent } from '../controllers/event.js';
import { getItems } from '../controllers/item.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:id_evento?', verifyToken, getEvents);
router.get('/:id_evento/insumos', verifyToken, getItems);
router.post('/', verifyToken, postEvent);
router.put('/', verifyToken, putEvent);
router.delete('/:id_evento', verifyToken, deleteEvent);

export default router;