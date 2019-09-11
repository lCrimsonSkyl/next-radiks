import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import Country from '../models/country';

const server = express();

// server.get('/poblate', (req, res) => {
//     const paises = []; // https://restcountries.eu/rest/v2/all
//     paises.map((pais, index) => {
//         const country = new Country({ name: pais.name, ISO_3166_1: pais.alpha2Code });
//         country.save((err, countryDB) => {
//             if (err) {
//                 console.log(err);
//                 console.log('error: ' + pais.name + " - " + index)
//             }
//             else {
//                 console.log('success: ' + pais.name + " - " + index)
//             }
//             return;
//         });
//     })

//     res.status(200).send();

// });

server.post('/country', (req, res) => {
    const datosEsperados = [
        'name', "ISO_3166_1"
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


    const country = new Country(datosConfirmados);
    country.save((err, countryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.status(200).json({
            ok: true,
            country: countryDB,
        });
    });
});

server.put('/country/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'ISO_3166_1'
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
    const condicion = { _id: ID };
    Country.findOneAndUpdate(condicion, datosConfirmados, { new: true }).exec((err, countryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!countryDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'country not found' },
            });
        }
        res.status(200).json({
            ok: true,
            country: countryDB,
        });
    });
});

server.delete('/country/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    // const borradoLogico = { isActive: false };

    Country.findByIdAndDelete(ID).exec((err, countryDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!countryDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'country not found' },
            });
        }
        res.status(200).json({
            ok: true,
            country: countryDB,
        });
    });
});

server.get('/country/:ID', (req, res) => {
    let { ID } = req.params;

    const condicion = ID.length === 2 ? "ISO_3166_1" : "_id";
    ID = ID.length === 2 ? ID.toUpperCase() : ID;

    Country.findOne({ [condicion]: ID }, { __v: 0 }).exec((err, countryDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!countryDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'country not found' },
            });
        }
        else if (!toBoolean(countryDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                permision: countryDB,
            });
        }
    });
});

server.get('/country', (req, res) => {
    Country.find({}, { __v: 0 }).exec((err, arraycountryDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraycountryDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'country not found' },
            });
        }
        else if (!toBoolean(arraycountryDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Country.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arraycountryDB,
                    cuantos: conteo,
                });
            });
        }
    });
});


module.exports = server;
