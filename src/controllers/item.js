import { selectItems, insertItem } from '../services/item.js';
import { postError, putError, deleteError, validationError, authenticationError, getError, uploadError } from '../utils/strings.js';

async function getItems(req, res, next) {
    if (req.user) {
        try {
            const idEvento = req.params.id_evento;
            const idUsuario = req.user.id_usuario;
            
            if (!idEvento) {
                res.status(400);
                res.json({ error: validationError });
            }

            res.json(await selectItems(idUsuario, idEvento));
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
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
            const idUsuario = req.user.id_usuario;

            console.log("Remover insumo " + idInsumo + " com usuário " + idUsuario);
            
            const resultado = await removeItem(idUsuario, idInsumo);
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

async function putItem(req, res, next) {
    if (req.user) {
        try {
            const { idInsumo, tipo, nome, descricao } = req.body;
            const idUsuario = req.user.id_usuario;

            if (!idInsumo || !tipo || !nome || !descricao) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Editar insumo " + nome);
            const insumo = await updateItem(idUsuario, idInsumo, tipo, nome, descricao);

            if (insumo) {
                res.json(insumo);
                return;
            }
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

async function postItem(req, res, next) {
    if (req.user) {
        try {
            const { idEvento, tipo, nome, descricao, valor } = req.body;
            const idUsuario = req.user.id_usuario;

            if (!idEvento || !tipo || !nome || !descricao || !valor) {
                res.status(400);
                res.json({ error: validationError });
                return;
            }

            console.log("Adicionar insumo " + nome);
            const insumo = await insertItem(idUsuario, idEvento, tipo, nome, descricao, valor);

            if (insumo) {
                res.json(insumo);
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

export { getItems, postItem, putItem, deleteItem };