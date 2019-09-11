import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import uuidv4 from 'uuid/v4';
import request from 'request';
import { toBoolean, isMongoId, isEmail } from 'validator';

// import { verificaToken, verificaAdminRole } from '../middleware/autenticacion'
import redisClient from '../../redisClient';

import { tokenExp, privateKey } from '../../config';

import User from '../models/user';
import Role from '../models/role';
import Company from '../models/company';
import Language from '../models/language';
import City from '../models/city';

const BCRYPT_SALT_ROUNDS = 12;

const rutaServidor = 'http://127.0.0.1:3002'; // local
const rutaServidorCorreo = 'http://127.0.0.1:3000';

const server = express();

server.post('/login', (req, res) => {
    const datosEsperados = [
        'password'
    ];
    const datosCondicionales = new Set([
        'email', 'userName'
    ]);

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
        else if (datosCondicionales.has(key)) {
            datosCondicionales.delete(key);
            datosConfirmados[key] = dato
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
    // Si llegaron email y userName, rechazar la peticion y pide que se envie solo uno
    else if (!toBoolean([...datosCondicionales].toString())) {
        res.status(400).json({
            ok: false,
            err: { message: `unexpected email and userName together. Please send the request with only one of them` },
        });
        return; // termina la ejecucion del proceso.
    }

    if (datosConfirmados.userName) {
        const machRegExp = (texto, regexp) => {
            const comprobacionRegexp = texto.match(regexp);
            if (!comprobacionRegexp) {
                return false;
            }
            if (comprobacionRegexp.lenght > 1) {
                return false;
            }
            if (!(comprobacionRegexp[0].length == texto.length)) {
                return false;
            }
            return true;
        }
        const regexp = /(?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?)?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9]{0,61}[a-zA-Z0-9])?)$/igm
        if (!machRegExp(datosConfirmados.userName, regexp)) {
            res.status(400).json({
                ok: false,
                err: { message: `the userName provided isn't valid` },
            });
            return; // termina la ejecucion del proceso.
        }
    }
    else {
        if (!isEmail(datosConfirmados.email)) {
            res.status(400).json({
                ok: false,
                err: { message: `the email provided isn't valid` },
            });
            return; // termina la ejecucion del proceso.
        }
    }

    const condicion = datosConfirmados.email ? { email: datosConfirmados.email } : { userName: datosConfirmados.userName }

    User.findOne(condicion).exec((err, userDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err
            });
        }
        else if (!userDB) {
            res.status(404).json({
                ok: false,
                err: { message: 'error in the data sended' }
            });
        }
        else if (!bcrypt.compareSync(datosConfirmados.password, userDB.password)) {
            res.status(400).json({
                ok: false,
                err: { message: 'incorrect password' }
            });
        }
        else {
            var token = jwt.sign({ user: userDB }, privateKey, { expiresIn: tokenExp });
            res.status(200).json({
                ok: true,
                user: userDB,
                token
            });
        }
    });
});

server.post('/register', (req, res) => {
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

                const user = datosConfirmados;
                const uniqueRegisterID = uuidv4();

                redisClient.hmset(uniqueRegisterID, "isActive", `${user.isActive}`);
                redisClient.hmset(uniqueRegisterID, "name", `${user.name}`);
                redisClient.hmset(uniqueRegisterID, "userName", `${user.userName}`);
                redisClient.hmset(uniqueRegisterID, "identificationNumber", `${user.identificationNumber}`);
                redisClient.hmset(uniqueRegisterID, "email", `${user.email}`);
                redisClient.hmset(uniqueRegisterID, "password", `${user.password}`);
                redisClient.hmset(uniqueRegisterID, "city", `${user.city}`);
                redisClient.hmset(uniqueRegisterID, "language", `${user.language}`);
                redisClient.hmset(uniqueRegisterID, "company", `${user.company}`);
                redisClient.expire(uniqueRegisterID, 3600);

                const fueGuardado = redisClient.hkeys(uniqueRegisterID, function (err, replies) {
                    const errores = replies.map(function (reply, i) {
                        return ("    " + i + ": " + reply);
                    });
                    return errores;
                });

                if (fueGuardado) {
                    const link = rutaServidor + "/confirmEmail/" + uniqueRegisterID;

                    request({
                        method: 'POST',
                        uri: rutaServidor + '/sendConfirmEmail',
                        body: JSON.stringify({ userName: user.name, address: user.email, link: link }),
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    }, function (error, response) {
                        if (!error && response.statusCode == 200) {
                            res.status(200).json({
                                ok: true,
                            });
                        }
                        else {
                            res.status(400).json({
                                ok: false,
                                err: { message: 'El sistema de registro no se encuentra activo en este momento. Por favor, intente más tarde' },
                            });
                        }
                    });
                } else {
                    res.status(400).json({
                        ok: false,
                        err: { message: 'El sistema de registro no se encuentra activo en este momento. Por favor, intente más tarde' },
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

server.get('/confirmEmail/:UUID', (req, res) => {
    const { UUID } = req.params;
    redisClient.exists(UUID + "", (error, isAlive) => {
        if (isAlive && !error) {
            redisClient.del(UUID + "");
            res.redirect('/');
        }
        else {
            res.status(400).json({
                ok: false,
                err: { message: 'noGuardado' },
            });
        }
    });
})

module.exports = server;