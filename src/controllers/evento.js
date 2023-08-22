import { selectEventos, insertEvento } from '../services/evento.js';

async function getEventos(req, res, next) {
    if (req.user) {
        const eventos = await selectEventos(req.user.id_usuario);
        console.log(eventos, req.user.id_usuario);
        res.json(eventos);
    } else {
        res.json( { error: "Houve um erro ao obter eventos." } );
    }
}

async function postEvento(req, res, next) {
    if (req.user) {
        const { nome } = req.body;

        console.log("Adicionar evento: " + nome);
        const evento = await insertEvento(req.user.id_usuario, nome);
        res.json(evento);
    } else {
        res.json( { error: "Houve um erro ao adicionar evento." } );
    }
}

export { getEventos, postEvento };