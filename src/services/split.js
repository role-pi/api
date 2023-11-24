import client from '../utils/database.js';

async function splitCosts(userId, itemIds, userIds) {
    if (userId) {
        var res = await client.query(`
            SELECT
                transacoes.usuarios_id_usuario,
                SUM(transacoes.valor) AS total
            FROM
                transacoes
            JOIN
                insumos ON transacoes.insumos_id_insumo = insumos.id_insumo
            WHERE
                insumos.id_insumo IN (?)
            GROUP BY
                transacoes.usuarios_id_usuario;
        `, [itemIds]);

        // res = [
        //     [
        //         {
        //             usuarios_id_usuario: 1,
        //             total: 4,
        //         },
        //         {
        //             usuarios_id_usuario: 2,
        //             total: 7,
        //         },
        //         {
        //             usuarios_id_usuario: 3,
        //             total: 2,
        //         },
        //         {
        //             usuarios_id_usuario: 4,
        //             total: 7,
        //         },
        //         {
        //             usuarios_id_usuario: 5,
        //             total: 11,
        //         }
        //     ]
        // ]

        // userIds = [1, 2, 3, 4, 5, 6];

        var total = 0;

        var totals = {};
        userIds.forEach(id => {
            totals[id] = 0;
        });

        res[0].forEach(result => {
            total+= parseFloat(result.total);
            var id = result.usuarios_id_usuario
            if (id in totals) {
                totals[id] = result.total;
            }
        });

        var average = total / userIds.length;
        console.log(average);

        var deltas = [];
        Object.entries(totals).forEach(([usuario, total]) => {
            deltas.push({
                usuario: usuario,
                delta: total - average
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
                    from: negativeDelta.usuario,
                    to: positiveDelta.usuario,
                    amount: Math.round(oweAmount*100)/100
                });
            });
        });

        console.log(pending);
    }
}

export { splitCosts };