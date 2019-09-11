import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import Permission from '../models/permission';

const server = express();

server.post('/permission', (req, res) => {
    const datosEsperados = [
        'name', 'description',
    ];

    const datosNoRecibidos = new Set(datosEsperados);
    const datosNoEsperados = [];

    const datosConfirmados = { isActive: true };

    // Todos los datos recibidos son formateados a tipo Object.
    const datosRecibidos = (Object.entries(req.body));

    // Recorre los datos recibidos y los busca en los datos esperados
    // Si los encuentra, los borra de la copia datosNoRecibidos.
    // Si un dato recibido no es de los esperados, se guarda la Key en el Set datosNoEsperados.

    datosRecibidos.map(([key, dato]) => {
        if (datosNoRecibidos.has(key)) {
            datosNoRecibidos.delete(key);
            datosConfirmados[key] = dato;
        }
        else {
            datosNoEsperados.push(key);
        }
    });
    // Si al menos un parametro no fue recibido
    if (toBoolean([...datosNoRecibidos].toString())) {
        res.status(400).json({
            ok: false,
            err: { message: `expected ${[...datosNoRecibidos].toString()}`.replace(',', ', ') },
        });
        return; // termina la ejecucion del proceso.
    }
    // Si al menos un parametro recibido no era de los esperados
    else if (toBoolean(datosNoEsperados.toString())) {
        res.status(400).json({
            ok: false,
            err: { message: `unexpected ${datosNoEsperados.toString()}`.replace(',', ', ') },
        });
        return; // termina la ejecucion del proceso.
    }


    const permission = new Permission(datosConfirmados);
    permission.save((err, permissionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.status(200).json({
            ok: true,
            permission: permissionDB,
        });
    });
});

server.put('/permission/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'description',
    ];

    const datosNoRecibidos = new Set(datosEsperados);
    const datosNoEsperados = [];

    // Se inicializa con un valor por defecto indicando el estado del borrado logico.

    const datosConfirmados = {};

    // Todos los datos recibidos son formateados a tipo Object.
    const datosRecibidos = (Object.entries(req.body));

    // Debe recibir al menos un campo que actualizar.
    if (datosRecibidos.length < 1) {
        res.status(400).json({
            ok: false,
            err: { message: `expected ${datosEsperados.toString()}`.replace(',', ', ') },
        });
        return; // termina la ejecucion del proceso.
    }

    // Recorre los datos recibidos y los busca en los datos esperados
    // Si los encuentra, los borra de la copia datosNoRecibidos.
    // Si un dato recibido no es de los esperados, se guarda la Key en el Set datosNoEsperados.

    datosRecibidos.map(([key, dato]) => {
        if (datosNoRecibidos.has(key)) {
            datosNoRecibidos.delete(key);
            datosConfirmados[key] = dato;
        }
        else {
            datosNoEsperados.push(key);
        }
    });

    // Si al menos un parametro recibido no era de los esperados
    if (toBoolean(datosNoEsperados.toString())) {
        res.status(400).json({
            ok: false,
            err: { message: `unexpected ${datosNoEsperados.toString()}`.replace(',', ', ') },
        });
        return; // termina la ejecucion del proceso.
    }
    const condicion = { _id: ID, isActive: true };
    Permission.findOneAndUpdate(condicion, datosConfirmados, { new: true }).exec((err, permissionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!permissionDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'permission not found' },
            });
        }
        res.status(200).json({
            ok: true,
            permission: permissionDB,
        });
    });
});

server.delete('/permission/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const borradoLogico = { isActive: false };

    Permission.findByIdAndUpdate(ID, borradoLogico, { new: true }).exec((err, permissionDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!permissionDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'permission not found' },
            });
        }
        res.status(200).json({
            ok: true,
            permission: permissionDB,
        });
    });
});

server.get('/permission/:ID', (req, res) => {
    const { ID } = req.params;
    Permission.findById(ID, { __v: 0 }).exec((err, permissionDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!permissionDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'permission not found' },
            });
        }
        else if (!toBoolean(permissionDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                permision: permissionDB,
            });
        }
    });
});

server.get('/permission', (req, res) => {
    const condicion = { isActive: true };
    Permission.find(condicion, { isActive: 0, __v: 0 }).exec((err, arrayPermissionDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayPermissionDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'permission not found' },
            });
        }
        else if (!toBoolean(arrayPermissionDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Permission.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arrayPermissionDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/permissionDeleted', (req, res) => {
    const condicion = { isActive: false };
    Permission.find(condicion, { isActive: 0, __v: 0 }).exec((err, arrayPermissionDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayPermissionDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'permission not found' },
            });
        }
        else if (!toBoolean(arrayPermissionDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Permission.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arrayPermissionDB,
                    total: conteo,
                });
            });
        }
    });
});


module.exports = server;
