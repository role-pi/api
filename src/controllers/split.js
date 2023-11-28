import { calculateSplitCosts } from '../services/split.js';
import { authenticationError, getError } from '../utils/strings.js';

async function splitCosts(req, res, next) {
    if (req.user) {
        try {
            const eventId = req.params.event_id;
            const userId = req.user.id_usuario;
            const itemIds = req.query.item_ids.split(',');
            const userIds = req.query.user_ids.split(',');

            let result = await calculateSplitCosts(userId, itemIds, userIds);
            console.log("Dividir custos de insumos " + itemIds + " com usuários " + userIds + " no evento " + eventId);

            res.status(200);
            res.json(result);
            return;
        } catch (error) {
            res.status(500);
            res.json({ error: getError });
            console.log(error);
        }

        res.status(500);
        res.json({ error: getError });
    } else {
        res.status(401);
        res.json({ error: authenticationError });
    }
}

export { splitCosts };