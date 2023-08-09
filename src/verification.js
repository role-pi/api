import jwt from 'jsonwebtoken';
import client from './db.js';

export class OTPCode {
    constructor() {
        this.code = this.generateCode();
        this.expiration = this.generateExpiration();
    }

    generateCode() {
        return Math.floor(Math.random() * 900000) + 100000;
    }

    generateExpiration() {
        return new Date().getTime() + 600000;
    }
}

// Verificar token JWT – se for válida, retorna o usuário
export const verifyToken = (req, res, next) => {
    // console.log(req);

    if (req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === 'JWT') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (err || decode == undefined) {
                req.user = undefined;
            }
            
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
        });
    } else {
        req.user = undefined;
        next();
    }
};