import { selectItem, selectItems, insertItem, removeItem, updateItem } from '../services/item.js';
import { postError, putError, deleteError, validationError, authenticationError, getError, uploadError } from '../utils/strings.js';

async function getItem(req, res, next) {
    if (req.user) {
        try {
            const idInsumo = req.params.id_insumo;
            const userId = req.user.id_usuario;
            
            if (!idInsumo) {
                res.status(400);
                res.json({ error: validationError });
            }

            const insumo = await selectItem(userId, idInsumo);
            res.json(insumo);
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
            res.json({ error: getError });
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function getItems(req, res, next) {
    if (req.user) {
        try {
            const userId = req.user.id_usuario;
            const eventId = req.params.event_id;
            console.log("Requerer insumos de evento " + eventId);

            if (!eventId) {
                res.status(400);
                res.json({ error: validationError });
            }

            const insumos = await selectItems(userId, eventId);
            res.json(insumos);
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

async function deleteItem(req, res, next) {
    if (req.user) {
        try {
            const idInsumo = req.params.id_insumo;
            const userId = req.user.id_usuario;

            console.log("Remover insumo " + idInsumo + " com usuário " + userId);
            
            const resultado = await removeItem(userId, idInsumo);
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

async function putItem(req, res, next) {
    if (req.user) {
        try {
            const { idInsumo, tipo, nome, notas } = req.body;
            const userId = req.user.id_usuario;

            if (!idInsumo || !tipo || !nome || !notas) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Editar insumo " + nome);
            const insumo = await updateItem(userId, idInsumo, tipo, nome, notas);
            if (insumo) {
                res.json(insumo);
                return;
            }
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

async function postItem(req, res, next) {
    if (req.user) {
        try {
            const { eventId, tipo, nome, notas, valor } = req.body;
            const userId = req.user.id_usuario;

            if (!eventId || !tipo || !nome || !notas || !valor) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar insumo " + nome);
            const insumo = await insertItem(userId, eventId, tipo, nome, notas, valor);

            if (insumo) {
                res.json(insumo);
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

export { getItem, getItems, postItem, putItem, deleteItem };