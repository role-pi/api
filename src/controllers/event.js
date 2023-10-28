import { selectEvents, selectEvent, insertEvent, removeEvent, updateEvent } from '../services/event.js';
import { postError, putError, deleteError, validationError, authenticationError, getError } from '../utils/strings.js';

async function getEvents(req, res, next) {
    if (req.user) {
        try {
            const idEvento = req.params.id_evento;
            const idUsuario = req.user.id_usuario;

            let resultado;
            if (idEvento) {
                resultado = await selectEvent(idUsuario, idEvento);
                console.log("Obter evento " + idEvento + " com usuário " + idUsuario);
            } else {
                resultado = await selectEvents(idUsuario);
                console.log("Obter eventos com usuário " + idUsuario);
            }

            res.status(200);
            res.json(resultado);
            return;
        } catch (error) {
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
            const idEvento = req.params.id_evento;
            const idUsuario = req.user.id_usuario;

            console.log("Remover evento " + idEvento + " com usuário " + idUsuario);
            
            const resultado = await removeEvent(idUsuario, idEvento);
            res.status(200);
            res.json(resultado);
            return;
        } catch (error) {
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
            const { idEvento, nome, emoji, cor1, cor2, dataInicio, dataFim } = req.body;

            console.log("Atualizar evento " + nome);

            const resultado = await updateEvent(idEvento, nome, emoji, cor1, cor2, dataInicio, dataFim);
            res.status(200);
            res.json(resultado);
            return;
        } catch (error) {
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