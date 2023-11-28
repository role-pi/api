import client from '../utils/database.js';

async function calculateSplitCosts(userId, itemIds, userIds) {
    if (userId) {
        var res = await client.query(`
            SELECT
                usuarios.*,
                SUM(transacoes.valor) AS total
            FROM
                transacoes
            JOIN
                insumos ON transacoes.insumos_id_insumo = insumos.id_insumo
            JOIN
                usuarios ON transacoes.usuarios_id_usuario = usuarios.id_usuario
            WHERE
                insumos.id_insumo IN (?)
            GROUP BY
                transacoes.usuarios_id_usuario;
        `, [itemIds]);

        var total = 0;

        var results = {};
        userIds.forEach(id => {
            results[id] = {};
        });

        res[0].forEach(result => {
            total+= parseFloat(result.total);
            var id = result.id_usuario;
            if (id in results) {
                results[id] = result;
            }
        });

        var average = total / userIds.length;

        var deltas = [];
        Object.entries(results).forEach(([id, result]) => {
            deltas.push({
                result: result,
                delta: result.total - average
            });
        });

        var positiveDeltas = [];
        var negativeDeltas = [];

        var totalPositive = 0;
        
        deltas.forEach(delta => {
            if (delta.delta > 0) {
                positiveDeltas.push(delta);
                totalPositive += delta.delta;
            } else if (delta.delta < 0) {
                negativeDeltas.push(delta);
            }
        });

        var pending = [];

        negativeDeltas.forEach(negativeDelta => {
            positiveDeltas.forEach(positiveDelta => {
                var oweAmount = (-negativeDelta.delta)*positiveDelta.delta/totalPositive;
                pending.push({
                    from: negativeDelta.result,
                    to: positiveDelta.result,
                    amount: Math.round(oweAmount*100)/100
                });
            });
        });

        return pending;
    }
}

export { calculateSplitCosts };