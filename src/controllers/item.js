import { selectItem, selectItems, insertItem, removeItem, updateItem } from '../services/item.js';
import { postError, putError, deleteError, validationError, authenticationError, getError, uploadError } from '../utils/strings.js';

async function getItem(req, res, next) {
    if (req.user) {
        try {
            const itemId = req.params.item_id;
            const userId = req.user.id_usuario;
            
            if (!itemId) {
                res.status(400);
                res.json({ error: validationError });
            }

            const insumo = await selectItem(userId, itemId);
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
            const itemId = req.params.item_id;
            const userId = req.user.id_usuario;

            console.log("Remover insumo " + itemId + " com usuário " + userId);
            
            const result = await removeItem(userId, itemId);
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

async function putItem(req, res, next) {
    if (req.user) {
        try {
            const { itemId, category, name, notes } = req.body;
            const userId = req.user.id_usuario;

            if (!itemId || !category || !name || !notes) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Editar insumo " + name);
            const item = await updateItem(userId, itemId, category, name, notes);
            if (item) {
                res.json(item);
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
            const { eventId, category, name, notes, amount } = req.body;
            const userId = req.user.id_usuario;

            if (!eventId || !category || !name || !notes || !amount) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar insumo " + name);
            const item = await insertItem(userId, eventId, category, name, notes, amount);

            if (item) {
                res.json(item);
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