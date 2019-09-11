import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import State from '../models/state';
import Country from '../models/country';

const server = express();

// server.get('/poblate', (req, res) => {

//     const regiones = []; //http://cne.cloudapi.junar.com/api/v2/datastreams/CODIG-UNICO-TERRI-REGIO-Y/data.ajson/?auth_key=e5509c285ae95627158240f0682e98769f335503

//     regiones.map((region) => {
//         const state = new State({ name: region, country: '5d40b5b74b9f9b453828e0c7' });

//         state.save((err, stateDB) => {
//             if (err) {
//                 console.log('error: ' + region);
//             }
//             else {
//                 console.log('success: ' + region);
//             }
//             return;
//         });
//     });

//     res.status(200).send();
// });

server.post('/state', (req, res) => {
    const datosEsperados = [
        'name', 'country'
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

    if (!isMongoId(datosConfirmados.country)) {
        res.status(400).json({
            ok: false,
            err: { message: `the ID ${datosConfirmados.country} is not valid` },
        });
        return;
    }

    // Se hace toda la siguiente comprobacion en una promesa, debido a problemas con el manejo de
    // procedimientos asincronos.
    const operacionesAsyncronas = async () => {
        const id = datosConfirmados.country;

        const resultado = await new Promise(resolve => {
            Country.findById(id, { __v: 0 }).exec((err, countryDB) => {
                if (err) {
                    resolve(err)
                }
                else if (!countryDB) {
                    const err = { message: 'country not found' }
                    resolve(err);
                }
                else if (!toBoolean(countryDB.toString())) {
                    const err = { message: 'document not found' }
                    resolve(err);
                }
                else {
                    resolve(true);
                }
            });
        });
        if (resultado === true) {
            console.log(datosConfirmados);
            const state = new State(datosConfirmados);
            state.save((err, stateDB) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err,
                    });
                }
                else {
                    res.status(200).json({
                        ok: true,
                        state: stateDB,
                    });
                }
            });
        }
        else {
            res.status(400).json({
                ok: false,
                err: resultado
            });
            return false;
        }
    }
    operacionesAsyncronas();
});

server.put('/state/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'country'
    ];

    const datosNoRecibidos = new Set(datosEsperados);
    const datosNoEsperados = [];

    const datosConfirmados = { isActive: true };

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
    // Se hace toda la siguiente comprobacion en una promesa, debido a problemas con el manejo de
    // procedimientos asincronos.

    if (toBoolean(datosNoEsperados.toString())) {
        res.status(400).json({
            ok: false,
            err: { message: `unexpected ${datosNoEsperados.toString()}`.replace(',', ', ') },
        });
        return;
    }
    else if (datosConfirmados.country) {
        // Si fue entregado un string, se comprueba que corresponda a un MongoID
        // Si no lo es, se rechaza la peticion
        // Si lo es, transforma el dato en un Array de string [ String ]
        // que luego será procesado por comprobacionDeExistencia()
        if (typeof datosConfirmados.country === 'string') {
            if (!isMongoId(datosConfirmados.country)) {
                res.status(400).json({
                    ok: false,
                    err: { message: `the country ID: ${datosConfirmados.country} is not valid`.replace(',', ', ') },
                });
                return;
            }
            else {
                datosConfirmados.country = [datosConfirmados.country];
            }
        }

        // Se crean arreglos vacios que almacenen los datos erroneos que se detecten.

        // Se eliminan country duplicados aprovechando la propiedad Unique del tipo de variable Set.
        const countryRecibidos = new Set(datosConfirmados.country);
        datosConfirmados.country = [...countryRecibidos];

        const operacionesAsyncronas = async () => {
            const countryNotValid = [];
            const countryNotFound = [];
            // Pausa la ejecucion del proceso hasta que termine la funcion 
            await new Promise(reject => {
                let contador = 0;
                // recorre los datos confirmados 
                datosConfirmados.country.map((country) => {
                    // comprueba que el country sea un MongoID
                    if (!isMongoId(country)) {
                        countryNotValid.push(country);
                        reject();
                    }
                    else {
                        // Busca en la base de datos el country
                        // Que tenga el id country y que no haya sido borrado logicamente.
                        const condicion = { _id: country };
                        Country.find(condicion).exec((err, countryDB) => {
                            // Si ocurrio un error
                            if (err) {
                                countryNotFound.push(country);
                            }
                            // Si no se encontro
                            else if (!countryDB) {
                                countryNotFound.push(country);
                            }
                            // Si no se encontro
                            else if (!toBoolean(countryDB.toString())) {
                                countryNotFound.push(country);
                            }

                            // Aumenta el contador y comprueba si no termino de leer el arreglo
                            contador++;
                            if (contador >= datosConfirmados.country.length) {
                                reject();
                            }
                        });
                    }
                });
            });

            if (countryNotValid.length > 0) {
                res.status(400).json({
                    ok: false,
                    err: { message: `the country ID: ${countryNotValid.toString()} are not valid`.replace(',', ', ') },
                });
            }
            else if (countryNotFound.length > 0) {
                res.status(400).json({
                    ok: false,
                    err: { message: `the country ID: ${countryNotFound.toString()} wasn't found in the db`.replace(',', ', ') }
                });
            }
            else {
                State.findOneAndUpdate({ _id: ID }, datosConfirmados, { new: true }).exec((err, stateDB) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            err,
                        });
                    }
                    else {
                        res.status(200).json({
                            ok: true,
                            state: stateDB,
                        });
                    }
                });
            }

        }
        operacionesAsyncronas();
    }
    else {
        State.findOneAndUpdate({ _id: ID }, datosConfirmados, { new: true }).exec((err, stateDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err,
                });
            }
            else {
                res.status(200).json({
                    ok: true,
                    state: stateDB,
                });
            }
        });
    }
    return;
});

server.get('/state/:ID', (req, res) => {
    const { ID } = req.params;
    State.findById(ID, { __v: 0 }).exec((err, stateDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!stateDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'state not found' },
            });
        }
        else if (!toBoolean(stateDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                state: stateDB,
            });
        }
    });
});

server.get('/stateByCountry/:ID', (req, res) => {
    const { ID } = req.params;
    State.find({ country: ID }, { __v: 0, country: 0 }).exec((err, arrayStateDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayStateDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'state not found' },
            });
        }
        else if (!toBoolean(arrayStateDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            State.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    states: arrayStateDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/state', (req, res) => {
    State.find({}, { __v: 0 }).exec((err, arraystateDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraystateDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'state not found' },
            });
        }
        else if (!toBoolean(arraystateDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            State.countDocuments({}, (error, conteo) => {
                res.json({
                    ok: true,
                    states: arraystateDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.delete('/state/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }


    State.findByIdAndDelete(ID).exec((err, stateDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!stateDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'state not found' },
            });
        }
        res.status(200).json({
            ok: true,
            state: stateDB,
        });
    });
});

module.exports = server;
