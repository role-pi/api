import jwt from 'jsonwebtoken';
import client from '../db.js';

export const verifyToken = (req, res, next) => {
    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (err || decode == undefined) {
                req.user = undefined;
                res.statusCode = 401;
                next();
            } else {
                var query = client.query(`
                SELECT * FROM usuarios WHERE id_usuario = ?
                `, [decode.id]).then((query) => {
                    if (query[0].length) {
                        const user = query[0][0];
                        req.user = user;
                        next();
                    } else {
                        req.user = undefined;
                        next();
                    }
                });
            }
        });
    } else {
        req.user = undefined;
        next();
    }
};