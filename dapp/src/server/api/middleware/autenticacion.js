import jwt from 'jsonwebtoken';
import { privateKey } from '../../config'

const verificaToken = (req, res, next) => {
    const token = req.get('token');

    jwt.verify(token, privateKey, (err, decoded) => {
        if (err) {
            if (err.name == 'TokenExpiredError') {
                return res.status(412).json({
                    ok: false,
                    err: {
                        message: 'Expired token',
                    },
                });
            }
            if (err.name == 'JsonWebTokenError') {
                return res.status(401).json({
                    ok: false,
                    err: {
                        message: 'Invalid token',
                    },
                });
            }
        }
        req.user = decoded.user;
        next();
    });
};

const verificaAdminRole = (req, res, next) => {
    const { user } = req;

    if (user.role === 'ADMIN_ROLE') {
        next();
    }
    else {
        return res.status(406).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador',
            },
        });
    }
};

module.exports = {
    verificaToken,
    verificaAdminRole,
};
