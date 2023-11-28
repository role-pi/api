import { generateReport } from '../services/report.js';
import { authenticationError, getError } from '../utils/strings.js';

async function makeReport(req, res, next) {
    if (req.user) {
        try {
            const eventId = req.params.event_id;
            const userId = req.user.id_usuario;

            let result = await generateReport(userId);
            console.log("Gerar relatório para usuário " + userId);

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

export { makeReport };