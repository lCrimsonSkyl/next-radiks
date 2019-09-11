import express from 'express';
import { toBoolean, isMongoId, isURL } from 'validator';

import Company from '../models/company';

const server = express();

server.post('/company', (req, res) => {
    const datosEsperados = [
        "name",
        "businessName",
        "identificationNumber",
        "address",
        "telephoneNumber",
        "cellphoneNumber",
        "webPage",
        "businessRotation",
        // "isActive",
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

    // console.log(isURL(datosConfirmados.webPage));

    if (!isURL(datosConfirmados.webPage)) {
        res.status(400).json({
            ok: false,
            err: { message: `webpage provided is not valid.` },
        });
        return; // termina la ejecucion del proceso.
    }

    const company = new Company(datosConfirmados);
    company.save((err, companyDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.status(200).json({
            ok: true,
            company: companyDB,
        });
    });

});

server.put('/company/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        "name",
        "businessName",
        "identificationNumber",
        "address",
        "telephoneNumber",
        "cellphoneNumber",
        "webPage",
        "businessRotation",
        // "isActive",
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

    if (datosConfirmados.webPage) {
        if (!isURL(datosConfirmados.webPage)) {
            res.status(400).json({
                ok: false,
                err: { message: `webpage provided is not valid.` },
            });
            return; // termina la ejecucion del proceso.
        }

    }

    const condicion = { _id: ID, isActive: true };
    Company.findOneAndUpdate(condicion, datosConfirmados, { new: true }).exec((err, companyDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!companyDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'company not found' },
            });
        }
        res.status(200).json({
            ok: true,
            company: companyDB,
        });
    });
});

server.delete('/company/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const borradoLogico = { isActive: false };

    Company.findByIdAndUpdate(ID, borradoLogico, { new: true }).exec((err, companyDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!companyDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'company not found' },
            });
        }
        res.status(200).json({
            ok: true,
            company: companyDB,
        });
    });
});

server.get('/company/:ID', (req, res) => {
    const { ID } = req.params;
    Company.findById(ID, { __v: 0 }).exec((err, companyDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!companyDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'company not found' },
            });
        }
        else if (!toBoolean(companyDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                permision: companyDB,
            });
        }
    });
});

server.get('/company', (req, res) => {
    const condicion = { isActive: true };
    Company.find(condicion, { isActive: 0, __v: 0 }).exec((err, arraycompanyDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraycompanyDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'company not found' },
            });
        }
        else if (!toBoolean(arraycompanyDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Company.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arraycompanyDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/companyDeleted', (req, res) => {
    const condicion = { isActive: false };
    Company.find(condicion, { isActive: 0, __v: 0 }).exec((err, arraycompanyDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraycompanyDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'company not found' },
            });
        }
        else if (!toBoolean(arraycompanyDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Company.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arraycompanyDB,
                    total: conteo,
                });
            });
        }
    });
});


module.exports = server;
