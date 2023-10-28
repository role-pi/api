import { selectItems, insertItem } from '../services/insumo.js';
import { erroAdd, erroUpdate, erroDelete, erroValidar, erroAutenticar, erroObter, erroUpload } from '../utils/strings.js';

async function getInsumos(req, res, next) {
    if (req.user) {
        try {
            const idEvento = req.params.id_evento;
            const idUsuario = req.user.id_usuario;
            
            if (!idEvento) {
                res.status(400);
                res.json({ error: erroValidar });
            }

            res.json(await selectItems(idUsuario, idEvento));
        } catch (error) {
            res.status(500);
            res.json({ error: erroObter });
        }
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function deleteInsumo(req, res, next) {
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
        res.json({ error: erroDelete });
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function putInsumo(req, res, next) {
    if (req.user) {
        try {
            const { idInsumo, tipo, nome, descricao } = req.body;
            const idUsuario = req.user.id_usuario;

            if (!idInsumo || !tipo || !nome || !descricao) {
                res.status(400);
                res.json({ error: erroValidar });
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
        res.json({ error: erroUpdate });
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function postInsumo(req, res, next) {
    if (req.user) {
        try {
            const { idEvento, tipo, nome, descricao, valor } = req.body;
            const idUsuario = req.user.id_usuario;

            if (!idEvento || !tipo || !nome || !descricao || !valor) {
                res.status(400);
                res.json({ error: erroValidar });
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
        res.json({ error: erroAdd });
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

export { getInsumos, postInsumo, putInsumo, deleteInsumo };