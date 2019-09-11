import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import Language from '../models/language';

const server = express();

server.post('/language', (req, res) => {
    const datosEsperados = [
        'name', 'ISO_639_1',
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


    const language = new Language(datosConfirmados);
    language.save((err, languageDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.status(200).json({
            ok: true,
            language: languageDB,
        });
    });
});

server.put('/language/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'ISO_639_1',
    ];

    const datosNoRecibidos = new Set(datosEsperados);
    const datosNoEsperados = [];

    // Se inicializa con un valor por defecto indicando el estado del borrado logico.

    const datosConfirmados = {};

    // Todos los datos recibidos son formateados a tipo Object.
    const datosRecibidos = (Object.entries(req.body));
    // Debe recibir al menos un campo que actualizar
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
    const condicion = { _id: ID };
    Language.findOneAndUpdate(condicion, datosConfirmados, { new: true }).exec((err, languageDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!languageDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'language not found' },
            });
        }
        res.status(200).json({
            ok: true,
            language: languageDB,
        });
    });
});

server.delete('/language/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    Language.findByIdAndDelete(ID).exec((err, languageDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!languageDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'language not found' },
            });
        }
        res.status(200).json({
            ok: true,
            language: languageDB,
        });
    });
});

server.get('/language/:ID', (req, res) => {
    const { ID } = req.params;

    const condicion = ID.length === 2 ? "ISO_639_1" : "_id";

    Language.findOne({ [condicion]: ID }, { __v: 0 }).exec((err, languageDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!languageDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'language not found' },
            });
        }
        else if (!toBoolean(languageDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                permision: languageDB,
            });
        }
    });
});

server.get('/language', (req, res) => {
    Language.find({}, { __v: 0 }).exec((err, arraylanguageDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraylanguageDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'language not found' },
            });
        }
        else if (!toBoolean(arraylanguageDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Language.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arraylanguageDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

module.exports = server;
