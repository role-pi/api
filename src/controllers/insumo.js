import { selectInsumos, insertInsumo } from '../services/insumo.js';

async function getInsumos(req, res, next) {
    if (req.user) {
        try {
            const { idEvento } = req.body;
            
            if (!idEvento) {
                res.status(400);
                res.json({ error: "Houve um erro com a requisição." });
            }

            const insumos = await selectInsumos(req.user.id_usuario, idEvento);
            res.json(insumos);
        } catch (error) {
            res.status(500);
            res.json({ error: "Houve um erro ao obter recursos." });
        }
    } else {
        res.status(401);
        res.json({ error: "Houve um problema de autenticação." });
    }
}

async function postInsumo(req, res, next) {
    if (req.user) {
        try {
            const { idEvento, tipo, nome, descricao, valor } = req.body;

            if (!idEvento || !tipo || !nome || !descricao || !valor) {
                res.status(400);
                res.json({ error: "Houve um erro com a requisição." });
                return;
            }

            console.log("Adicionar insumo: " + nome);
            const insumo = await insertInsumo(req.user.id_usuario, idEvento, tipo, nome, descricao, valor);

            if (insumo) {
                res.json(insumo);
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

export { getInsumos, postInsumo };