import express from 'express';
import { getEvents, postEvent, putEvent, putUsers, deleteUser, deleteEvent } from '../controllers/event.js';
import { splitCosts } from '../controllers/split.js';
import { getItems } from '../controllers/item.js';
import { verifyToken } from '../middlewares/verification.js';

const router = express.Router()

router.get('/:event_id?', verifyToken, getEvents);
router.get('/:event_id/items', verifyToken, getItems);
router.get('/:event_id/split', verifyToken, splitCosts);
router.post('/', verifyToken, postEvent);
router.put('/', verifyToken, putEvent);
router.put('/:event_id/users', verifyToken, putUsers);
router.delete('/:event_id/:user_id', verifyToken, deleteUser);
router.delete('/:event_id', verifyToken, deleteEvent);

export default router;