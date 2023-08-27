import { selectEventos, insertEvento } from '../services/evento.js';

async function getEventos(req, res, next) {
    if (req.user) {
        try {
            const eventos = await selectEventos(req.user.id_usuario);
            res.json(eventos);
        } catch (error) {
            res.status(500);
            res.json({ error: "Ocorreu um erro ao obter eventos." });
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

            console.log("Adicionar evento: " + nome);
            const evento = await insertEvento(req.user.id_usuario, nome, emoji, cor1, cor2);
            res.json(evento);
            return;
        } catch (error) {
            console.log(error);
            res.status(500);
            res.json({ error: "Ocorreu um erro ao adicionar o evento." });
        }
    } else {
        res.status(401);
        res.json({ error: "Houve um problema de autenticação." });
    }
}

export { getEventos, postEvento };