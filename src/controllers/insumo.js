import { selectInsumos, insertInsumo } from '../services/insumo.js';
import { erroAdd, erroValidar, erroAutenticar, erroObter, erroUpload } from '../utils/strings.js';

async function getInsumos(req, res, next) {
    if (req.user) {
        try {
            const idEvento = req.params.id_evento;
            
            if (!idEvento) {
                res.status(400);
                res.json({ error: erroValidar });
            }

            const insumos = await selectInsumos(req.user.id_usuario, idEvento);
            res.json(insumos);
        } catch (error) {
            res.status(500);
            res.json({ error: erroObter });
        }
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

async function postInsumo(req, res, next) {
    if (req.user) {
        try {
            const { idEvento, tipo, nome, descricao, valor } = req.body;

            if (!idEvento || !tipo || !nome || !descricao || !valor) {
                res.status(400);
                res.json({ error: erroValidar });
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
        res.json({ error: erroAdd});
    } else {
        res.status(401);
        res.json({ error: erroAutenticar });
    }
}

export { getInsumos, postInsumo };