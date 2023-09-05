import { selectEventos, insertEvento } from '../services/evento.js';

async function getEventos(req, res, next) {
    if (req.user) {
        try {
            const eventos = await selectEventos(req.user.id_usuario);
            res.json(eventos);
        } catch (error) {
            res.status(500);
            res.json({ error: "Ocorreu um erro ao obter recursos." });
        }
    } else {
        res.status(401);
        res.json({ error: "Houve um problema de autenticação." });
    }
}

async function deleteEvento(req, res, next) {
    if (req.user) {
        try {
            const eventos = await deleteEvento(req.user.id_evento);
            res.json(eventos);
        } catch (error) {
            res.status(500);
            res.json({ error: "Ocorreu um erro ao obter recursos." });
        }
    } else {
        res.status(401);
        res.json({ error: "Houve um problema de autenticação." });
    }
}

async function postEvento(req, res, next) {
    if (req.user) {
        try {
            const { nome, emoji, cor1, cor2 } = req.body;

            if (!nome || !emoji || !cor1 || !cor2) {
                res.status(400);
                res.json({ error: "Houve um erro com a requisição." });
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
        res.json({ error: "Houve um erro ao adicionar o recurso." });
    } else {
        res.status(401);
        res.json({ error: "Houve um problema de autenticação." });
    }
}

export { getEventos, postEvento, deleteEvento };