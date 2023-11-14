import { selectEvents, selectEvent, insertEvent, removeEvent, updateEvent } from '../services/event.js';
import { postError, putError, deleteError, validationError, authenticationError, getError } from '../utils/strings.js';

async function getEvents(req, res, next) {
    if (req.user) {
        try {
            const eventId = req.params.event_id;
            const userId = req.user.id_usuario;

            let result;
            if (eventId) {
                result = await selectEvent(userId, eventId);
                console.log("Obter evento " + eventId + " com usuário " + userId);
            } else {
                result = await selectEvents(userId);
                console.log("Obter eventos com usuário " + userId);
            }

            res.status(200);
            res.json(result);
            return;
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: getError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function deleteEvent(req, res, next) {
    if (req.user) {
        try {
            const eventId = req.params.event_id;
            const userId = req.user.id_usuario;

            console.log("Remover evento " + eventId + " com usuário " + userId);
            
            const result = await removeEvent(userId, eventId);
            res.status(200);
            res.json(result);
            return;
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: deleteError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function putEvent(req, res, next) {
    if (req.user) {
        try {
            const { eventId, name, emoji, color1, color2, startDate, endDate } = req.body;
            const userId = req.user.id_usuario;

            console.log("Atualizar evento " + name);

            const result = await updateEvent(eventId, name, emoji, color1, color2, startDate, endDate);
            res.status(200);
            res.json(result);
            return;
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: putError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function postEvent(req, res, next) {
    if (req.user) {
        try {
            const { name, emoji, color1, color2 } = req.body;
            const userId = req.user.id_usuario;

            if (!name || !emoji || !color1 || !color2) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar evento " + name);
            const evento = await insertEvent(userId, name, emoji, color1, color2);

            if (evento) {
                res.status(200);
                res.json(evento);
                return;
            }
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: postError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

export { getEvents, postEvent, putEvent, deleteEvent };