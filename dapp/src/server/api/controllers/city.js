import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import City from '../models/city';

const server = express();

// server.get('/poblate', (req, res) => {
//     const ciudades = []; //http://cne.cloudapi.junar.com/api/v2/datastreams/CODIG-UNICO-TERRI-REGIO-Y/data.ajson/?auth_key=e5509c285ae95627158240f0682e98769f335503
//     ciudades.map((arrayCiudad) => {
//         const objeto = { name: arrayCiudad[5], state: arrayCiudad[1] }
//         const city = new City(objeto);
//         city.save((err, cityDB) => {
//             if (err) {
//                 console.log('error: ' + city.name);
//             }
//             else {
//                 console.log('success: ' + city.name);
//             }
//             return;
//         });
//     })

//     res.status(200).send();

// });

server.post('/city', (req, res) => {
    const datosEsperados = [
        'name', 'state'
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

    if (!isMongoId(datosConfirmados.state)) {
        res.status(400).json({
            ok: false,
            err: { message: `the ID ${datosConfirmados.state} is not valid` },
        });
        return;
    }

    const city = new City(datosConfirmados);

    city.save((err, cityDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        res.status(200).json({
            ok: true,
            city: cityDB,
        });
    });
});


server.put('/city/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'state',
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

    if (!isMongoId(datosConfirmados.state)) {
        res.status(400).json({
            ok: false,
            err: { message: `the ID ${datosConfirmados.state} is not valid` },
        });
        return;
    }

    const condicion = { _id: ID };

    City.findOneAndUpdate(condicion, datosConfirmados, { new: true }).exec((err, cityDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!cityDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'city not found' },
            });
        }
        res.status(200).json({
            ok: true,
            city: cityDB,
        });
    });
});

server.delete('/city/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    City.findByIdAndDelete(ID).exec((err, cityDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!cityDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'city not found' },
            });
        }
        res.status(200).json({
            ok: true,
            city: cityDB,
        });
    });
});

server.get('/city/:ID', (req, res) => {
    const { ID } = req.params;
    City.findById(ID, { __v: 0 }).exec((err, cityDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!cityDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'city not found' },
            });
        }
        else if (!toBoolean(cityDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                permision: cityDB,
            });
        }
    });
});

server.get('/city', (req, res) => {
    City.find({}, { __v: 0 }).exec((err, arraycityDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraycityDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'city not found' },
            });
        }
        else if (!toBoolean(arraycityDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            City.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arraycityDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

module.exports = server;
