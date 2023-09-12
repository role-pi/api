import { selectEventos, insertEvento, removeEvento } from '../services/evento.js';
import { erroAdd, erroValidar, erroAutenticar, erroObter } from '../utils/strings.js';

async function getEventos(req, res, next) {
    if (req.user) {
        try {
            const eventos = await selectEventos(req.user.id_usuario);
            res.json(eventos);
        } catch (error) {
            res.status(500);
            res.json({ error: erroObter });
        }
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function deleteEvento(req, res, next) {
    if (req.user) {
        try {
            const eventos = await removeEvento(req.user.id_usuario, req.id_evento);
            res.json(eventos);
        } catch (error) {
            res.status(500);
            res.json({ error: erroObter });
        }
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function postEvento(req, res, next) {
    if (req.user) {
        try {
            const { nome, emoji, cor1, cor2 } = req.body;

            if (!nome || !emoji || !cor1 || !cor2) {
                res.status(400);
                res.json({ error: erroValidar });
                return;
            }

            console.log("Adicionar evento: " + nome);
            const evento = await insertEvento(req.user.id_usuario, nome, emoji, cor1, cor2);

            if (evento) {
                res.json(evento);
                return;
            }
        } catch (error) {
            console.log(error);
        }

        res.status(500);
        res.json({ error: erroAdd });
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

export { getEventos, postEvento, deleteEvento };