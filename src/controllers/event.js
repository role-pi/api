import { selectEvents, selectEvent, insertEvent, removeEvent, updateEvent } from '../services/event.js';
import { postError, putError, deleteError, validationError, authenticationError, getError } from '../utils/strings.js';

async function getEvents(req, res, next) {
    if (req.user) {
        try {
            const eventId = req.params.id_evento;
            const userId = req.user.id_usuario;

            let resultado;
            if (eventId) {
                resultado = await selectEvent(userId, eventId);
                console.log("Obter evento " + eventId + " com usuário " + userId);
            } else {
                resultado = await selectEvents(userId);
                console.log("Obter eventos com usuário " + userId);
            }

            res.status(200);
            res.json(resultado);
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
            const eventId = req.params.id_evento;
            const userId = req.user.id_usuario;

            console.log("Remover evento " + eventId + " com usuário " + userId);
            
            const resultado = await removeEvent(userId, eventId);
            res.status(200);
            res.json(resultado);
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
            const { eventId, nome, emoji, cor1, cor2, dataInicio, dataFim } = req.body;

            console.log("Atualizar evento " + nome);

            const resultado = await updateEvent(eventId, nome, emoji, cor1, cor2, dataInicio, dataFim);
            res.status(200);
            res.json(resultado);
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
            const { nome, emoji, cor1, cor2 } = req.body;

            if (!nome || !emoji || !cor1 || !cor2) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar evento " + nome);
            const evento = await insertEvent(req.user.id_usuario, nome, emoji, cor1, cor2);

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