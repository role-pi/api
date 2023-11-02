import express from 'express';
import { getEvents, postEvent, putEvent, deleteEvent } from '../controllers/event.js';
import { getItems } from '../controllers/item.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:event_id?', verifyToken, getEvents);
router.get('/:event_id/items', verifyToken, getItems);
router.post('/', verifyToken, postEvent);
router.put('/', verifyToken, putEvent);
router.delete('/:event_id', verifyToken, deleteEvent);

export default router;