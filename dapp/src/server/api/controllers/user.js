import express from 'express';
import bcrypt from 'bcrypt';
// import jwt from 'jsonwebtoken';
import { toBoolean, isMongoId, isEmail } from 'validator';

// import { verificaToken, verificaAdminRole } from '../middleware/autenticacion'
// import { tokenExp, privateKey } from '../../config';

import User from '../models/user';
import Role from '../models/role';
import Company from '../models/company';
import Language from '../models/language';
import City from '../models/city';

const server = express();

const BCRYPT_SALT_ROUNDS = 12;

server.post('/user', (req, res) => {
    const datosEsperados = [
        "name",
        "userName",
        "identificationNumber",
        "email",
        "password",
        "role",
        "city",
        "language",
        "company",
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
    // Se hace toda la siguiente comprobacion en una promesa, debido a problemas con el manejo de
    // procedimientos asincronos.
    new Promise((resolveGlobal, rejectGlobal) => {
        // Si al menos un parametro no fue recibido

        const regexp = /(?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?)$/igm
        const comprobacionRegexp = datosConfirmados.userName.match(regexp);
        if (!comprobacionRegexp) {
            rejectGlobal(`the userName is not valid`);
        }
        if (comprobacionRegexp.lenght > 1) {
            rejectGlobal(`the userName is not valid`);
        }
        if (!(comprobacionRegexp[0].length == datosConfirmados.userName.length)) {
            rejectGlobal(`the userName is not valid`);
        }
        if (!isEmail(datosConfirmados.email)) {
            rejectGlobal(`the email: ${datosConfirmados.email} is not valid`);
        }
        if (!isMongoId(datosConfirmados.role)) {
            rejectGlobal(`the role ID: ${datosConfirmados.role} is not valid`);
        }
        if (!isMongoId(datosConfirmados.city)) {
            rejectGlobal(`the city ID: ${datosConfirmados.city} is not valid`);
        }
        if (!isMongoId(datosConfirmados.company)) {
            rejectGlobal(`the company ID: ${datosConfirmados.company} is not valid`);
        }
        if (!isMongoId(datosConfirmados.language)) {
            rejectGlobal(`the language ID: ${datosConfirmados.language} is not valid`);
        }

        const comprobacionDeExistencia = async () => {

            // Pausa la ejecucion del proceso hasta que termine la funcion 
            const buscaRole = new Promise(respuesta => {
                Role.findOne({ _id: datosConfirmados.role, isActive: true }).exec((err, roleDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!roleDB) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!toBoolean(roleDB.toString())) {
                        respuesta(false);
                    }
                    else {
                        respuesta(true);
                    }
                });
            });
            const buscaCity = new Promise(respuesta => {
                City.findById(datosConfirmados.city).exec((err, cityDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!cityDB) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!toBoolean(cityDB.toString())) {
                        respuesta(false);
                    }
                    else {
                        respuesta(true);
                    }
                });
            });
            const buscaLanguage = new Promise(respuesta => {
                Language.findById(datosConfirmados.language).exec((err, languageDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!languageDB) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!toBoolean(languageDB.toString())) {
                        respuesta(false);
                    }
                    else {
                        respuesta(true);
                    }
                });
            });
            const buscaCompany = new Promise(respuesta => {
                Company.findOne({ _id: datosConfirmados.company, isActive: true }).exec((err, companyDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!companyDB) {
                        respuesta(false);
                    }
                    // Si no se encontro
                    else if (!toBoolean(companyDB.toString())) {
                        respuesta(false);
                    }
                    else {
                        respuesta(true);
                    }
                });
            });


            let respuesta = await Promise.all([buscaRole, buscaCity, buscaLanguage, buscaCompany]);
            if (respuesta[0] == false) {
                rejectGlobal("the role provided is not valid");
                return;
            }
            else if (respuesta[1] == false) {
                rejectGlobal("the city provided is not valid");
                return;
            }
            else if (respuesta[2] == false) {
                rejectGlobal("the language provided is not valid");
                return;
            }
            else if (respuesta[3] == false) {
                rejectGlobal("the company provided is not valid");
                return;
            }
            respuesta = new Set(respuesta);
            if (respuesta.has(false)) { //Si encontro un error
                rejectGlobal();
                return;
            }
            resolveGlobal();
        }
        comprobacionDeExistencia();
    }).then(
        () => { // Si no hubo ningun error
            bcrypt.hash(datosConfirmados.password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
                datosConfirmados.password = hashedPassword;
                const user = new User(datosConfirmados);
                user.save((err, userDB) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            err,
                        });
                    }
                    else {
                        res.status(200).json({
                            ok: true,
                            user: userDB,
                        });
                    }
                });
            });
        },
        rejected => { //Si hubo algun error
            const errMessage = rejected;
            res.status(400).json({
                ok: false,
                err: { message: errMessage },
            });
        }
    );
    return;

    // bcrypt.hash(req.body.password, BCRYPT_SALT_ROUNDS).then((hashedPassword) => {
    //     const newUser = new User({
    //         name: req.body.name,
    //         email: req.body.email,
    //         password: hashedPassword,
    //         role: req.body.role
    //     });

    //     newUser.save((err, newUserDB) => {
    //         if (err) {
    //             res.status(400).json({
    //                 ok: false,
    //                 err
    //             });
    //         }
    //         else if (!newUserDB) {
    //             res.status(400).json({
    //                 ok: false,
    //                 err: { message: 'the user wasnt\' saved' }
    //             });
    //         }
    //         else {
    //             res.status(200).json({
    //                 ok: true,
    //             });
    //         }
    //     });
    // });
});

server.put('/user/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        "email",
        "role",
        "city",
        "language",
        "company",
    ];

    const datosNoRecibidos = new Set(datosEsperados);
    const datosNoEsperados = [];

    const datosConfirmados = {};

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

    // Si al menos un parametro recibido no era de los esperados
    if (toBoolean(datosNoEsperados.toString())) {
        res.status(400).json({
            ok: false,
            err: { message: `unexpected ${datosNoEsperados.toString()}`.replace(',', ', ') },
        });
        return; // termina la ejecucion del proceso.
    }

    // Se hace toda la siguiente comprobacion en una promesa, debido a problemas con el manejo de
    // procedimientos asincronos.
    new Promise((resolveGlobal, rejectGlobal) => {
        // Si al menos un parametro no fue recibido
        if (datosConfirmados.email) {
            if (!isEmail(datosConfirmados.email)) {
                rejectGlobal(`the email: ${datosConfirmados.email} is not valid`);
            }
        }
        if (datosConfirmados.role) {
            if (!isMongoId(datosConfirmados.role)) {
                rejectGlobal(`the role ID: ${datosConfirmados.role} is not valid`);
            }
        }
        if (datosConfirmados.city) {
            if (!isMongoId(datosConfirmados.city)) {
                rejectGlobal(`the city ID: ${datosConfirmados.city} is not valid`);
            }
        }
        if (datosConfirmados.company) {
            if (!isMongoId(datosConfirmados.company)) {
                rejectGlobal(`the company ID: ${datosConfirmados.company} is not valid`);
            }
        }
        if (datosConfirmados.language) {
            if (!isMongoId(datosConfirmados.language)) {
                rejectGlobal(`the language ID: ${datosConfirmados.language} is not valid`);
            }
        }

        const comprobacionDeExistencia = async () => {
            // Pausa la ejecucion del proceso hasta que termine la funcion 
            const buscaRole = new Promise(respuesta => {
                Role.findOne({ _id: datosConfirmados.role, isActive: true }).exec((err, roleDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta('role');
                    }
                    // Si no se encontro
                    else if (!roleDB) {
                        respuesta('role');
                    }
                    // Si no se encontro
                    else if (!toBoolean(roleDB.toString())) {
                        respuesta('role');
                    }
                    else {
                        respuesta(true);
                    }
                });
            });
            const buscaCity = new Promise(respuesta => {
                City.findById(datosConfirmados.city).exec((err, cityDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta('city');
                    }
                    // Si no se encontro
                    else if (!cityDB) {
                        respuesta('city');
                    }
                    // Si no se encontro
                    else if (!toBoolean(cityDB.toString())) {
                        respuesta('city');
                    }
                    else {
                        respuesta(true);
                    }
                });
            });
            const buscaLanguage = new Promise(respuesta => {
                Language.findById(datosConfirmados.language).exec((err, languageDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta('language');
                    }
                    // Si no se encontro
                    else if (!languageDB) {
                        respuesta('language');
                    }
                    // Si no se encontro
                    else if (!toBoolean(languageDB.toString())) {
                        respuesta('language');
                    }
                    else {
                        respuesta(true);
                    }
                });
            });
            const buscaCompany = new Promise(respuesta => {
                Company.findOne({ _id: datosConfirmados.company, isActive: true }).exec((err, companyDB) => {
                    // Si ocurrio un error
                    if (err) {
                        respuesta('company');
                    }
                    // Si no se encontro
                    else if (!companyDB) {
                        respuesta('company');
                    }
                    // Si no se encontro
                    else if (!toBoolean(companyDB.toString())) {
                        respuesta('company');
                    }
                    else {
                        respuesta(true);
                    }
                });
            });

            let lookFor = [];
            if (datosConfirmados.role) {
                lookFor.push(buscaRole);
            }
            if (datosConfirmados.city) {
                lookFor.push(buscaCity);
            }
            if (datosConfirmados.language) {
                lookFor.push(buscaLanguage);
            }
            if (datosConfirmados.company) {
                lookFor.push(buscaCompany);
            }

            if (lookFor.length < 1) {
                resolveGlobal();
                return;
            }
            let respuesta = await Promise.all(lookFor);

            const respuestaSet = new Set(respuesta);
            respuesta = [...respuestaSet];
            if (!(respuestaSet.has(true) && respuesta.length == 1)) {
                const errores = [...respuestaSet].map((error) => {
                    if (!(error === true)) {
                        return `${error}`;
                    }
                    return "";
                })
                rejectGlobal(`the ${errores} provided are not valid`);
                return;
            }

            resolveGlobal();
        }

        comprobacionDeExistencia();

    }).then(
        () => { // Si no hubo ningun error
            User.findOneAndUpdate({ _id: ID, isActive: true }, datosConfirmados, { new: true }).exec((err, userDB) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err,
                    });
                }
                else {
                    res.status(200).json({
                        ok: true,
                        user: userDB,
                    });
                }
            });
        },
        rejected => { //Si hubo algun error
            const errMessage = rejected;
            res.status(400).json({
                ok: false,
                err: { message: errMessage },
            });
        }
    );
    return;
});

server.get('/user', (req, res) => {
    const condicion = { isActive: true };
    User.find(condicion, { isActive: 0, __v: 0 }).exec((err, arrayUserDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayUserDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'users not found' },
            });
        }
        else if (!toBoolean(arrayUserDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'users not found' },
            });
        }
        else {
            User.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    users: arrayUserDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/userDeleted', (req, res) => {
    const condicion = { isActive: false };
    User.find(condicion, { isActive: 0, __v: 0 }).exec((err, arrayUserDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayUserDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'users not found' },
            });
        }
        else if (!toBoolean(arrayUserDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'users not found' },
            });
        }
        else {
            User.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    users: arrayUserDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/user/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const condicion = { isActive: true, _id: ID };

    User.find(condicion, { isActive: 0, __v: 0 }).exec((err, arrayUserDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayUserDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'user not found' },
            });
        }
        else if (!toBoolean(arrayUserDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'user not found' },
            });
        }
        else {
            res.json({
                ok: true,
                users: arrayUserDB,
            });
        }
    });
});

server.delete('/user/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const condicion = { isActive: true, _id: ID };

    User.findOneAndUpdate(condicion, { isActive: false }, { new: true }).exec((err, arrayUserDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayUserDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'user not found' },
            });
        }
        else if (!toBoolean(arrayUserDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'user not found' },
            });
        }
        else {
            res.json({
                ok: true,
                users: arrayUserDB,
            });
        }
    });
});

module.exports = server;
