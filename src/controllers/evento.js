import { selectEventos, selectEvento, insertEvento, removeEvento, updateEvento } from '../services/evento.js';
import { erroAdd, erroValidar, erroAutenticar, erroObter } from '../utils/strings.js';

async function getEventos(req, res, next) {
    if (req.user) {
        try {
            let resultado;
            if (req.params.id_evento) {
                resultado = await selectEventos(req.user.id_usuario)
            } else {
                resultado = await selectEvento(req.user.id_usuario, req.params.id_evento);
            }

            res.status(200);
            res.json(resultado);
            return;
        } catch (error) {
            console.log(error);
        }

        res.status(500);
        res.json({ error: erroObter });
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function deleteEvento(req, res, next) {
    if (req.user) {
        try {
            const idEvento = req.params.id_evento;
            const idUsuario = req.user.id_usuario;

            console.log("Remover evento " + idEvento + " com usuário " + idUsuario);
            
            const resultado = await removeEvento(idUsuario, idEvento);
            res.status(200);
            res.json(resultado);
            return;
        } catch (error) {
            console.log(error);
        }

        res.status(500);
        res.json({ error: erroObter });
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function putEvento(req, res, next) {
    if (req.user) {
        try {
            const { idEvento, nome, emoji, cor1, cor2, dataInicio, dataFim } = req.body;

            console.log("Atualizar evento " + nome);

            const resultado = await updateEvento(idEvento, nome, emoji, cor1, cor2, dataInicio, dataFim);
            res.status(200);
            res.json(resultado);
            return;
        } catch (error) {
            console.log(error);
        }

        res.status(500);
        res.json({ error: erroObter });
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

            console.log("Adicionar evento " + nome);
            const evento = await insertEvento(req.user.id_usuario, nome, emoji, cor1, cor2);

            if (evento) {
                res.status(200);
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

export { getEventos, postEvento, putEvento, deleteEvento };