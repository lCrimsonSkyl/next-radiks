import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import System from '../models/system';
import Role from '../models/role';

const server = express();

server.post('/system', (req, res) => {
    const datosEsperados = [
        'name', 'description', 'roles'
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
        // Si fue entregado un string, se comprueba que corresponda a un MongoID
        // Si no lo es, se rechaza la peticion
        // Si lo es, transforma el dato en un Array de string [ String ]
        // que luego será procesado por comprobacionDeExistencia()
        if (typeof datosConfirmados.roles === 'string') {
            if (!isMongoId(datosConfirmados.roles)) {
                rejectGlobal(`the role ID: ${datosConfirmados.roles} is not valid`);
            }
            else {
                datosConfirmados.roles = [datosConfirmados.roles];
            }
        }
        // Se crean arreglos vacios que almacenen los datos erroneos que se detecten.
        let rolesNoValidos = [];
        const roleNotFound = [];

        // Se eliminan roles duplicados aprovechando la propiedad Unique del tipo de variable Set.
        const rolesRecibidos = new Set(datosConfirmados.roles);
        datosConfirmados.roles = [...rolesRecibidos];

        const comprobacionDeExistencia = async () => {
            // Pausa la ejecucion del proceso hasta que termine la funcion 
            await new Promise(reject => {
                let contador = 0;
                // recorre los datos confirmados 
                datosConfirmados.roles.map((permiso) => {
                    // comprueba que el permiso sea un MongoID
                    if (!isMongoId(permiso)) {
                        rolesNoValidos.push(permiso);
                        reject();
                    }
                    else {
                        // Busca en la base de datos el permiso
                        // Que tenga el id permiso y que no haya sido borrado logicamente.
                        const condicion = { _id: permiso, isActive: true };
                        Role.find(condicion).exec((err, roleDB) => {
                            // Si ocurrio un error
                            if (err) {
                                roleNotFound.push(permiso);
                            }
                            // Si no se encontro
                            else if (!roleDB) {
                                roleNotFound.push(permiso);
                            }
                            // Si no se encontro
                            else if (!toBoolean(roleDB.toString())) {
                                roleNotFound.push(permiso);
                            }

                            // Aumenta el contador y comprueba si no termino de leer el arreglo
                            contador++;
                            if (contador >= datosConfirmados.roles.length) {
                                reject();
                            }
                        });
                    }
                });
            });

            // Si hay al menos un permiso no valido
            if (rolesNoValidos.length > 0) {
                rejectGlobal(`the roles ID: ${rolesNoValidos.toString()} are not valid`.replace(',', ', '))
            }
            // Si hay al menos un permiso no encontrado en la DB
            else if (roleNotFound.length > 0) {
                rejectGlobal(`the roles ID: ${roleNotFound.toString()} wasn't found in the db`.replace(',', ', '));
            }
            // Si no hubo ningun error, acepta la peticion
            else {
                resolveGlobal();
            }
        }
        comprobacionDeExistencia();
    }).then(
        () => { // Si no hubo ningun error
            console.log(datosConfirmados);
            const system = new System(datosConfirmados);
            system.save((err, systemDB) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err,
                    });
                }
                else {
                    res.status(200).json({
                        ok: true,
                        system: systemDB,
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

server.put('/system/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'description', 'roles',
        // 'isActive',
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
    else if (datosConfirmados.roles) {
        // Si fue entregado un string, se comprueba que corresponda a un MongoID
        // Si no lo es, se rechaza la peticion
        // Si lo es, transforma el dato en un Array de string [ String ]
        // que luego será procesado por comprobacionDeExistencia()
        if (typeof datosConfirmados.roles === 'string') {
            if (!isMongoId(datosConfirmados.roles)) {
                res.status(400).json({
                    ok: false,
                    err: { message: `the role ID: ${datosConfirmados.roles} is not valid`.replace(',', ', ') },
                });
                return;
            }
            else {
                datosConfirmados.roles = [datosConfirmados.roles];
            }
        }
        new Promise((resolveGlobal, rejectGlobal) => {
            // Si al menos un parametro recibido no era de los esperados

            // Se crean arreglos vacios que almacenen los datos erroneos que se detecten.
            let roleNotValid = [];
            const roleNotFound = [];

            // Se eliminan permisos duplicados aprovechando la propiedad Unique del tipo de variable Set.
            const permisosRecibidos = new Set(datosConfirmados.roles);
            datosConfirmados.roles = [...permisosRecibidos];

            const comprobacionDeExistencia = async () => {
                // Pausa la ejecucion del proceso hasta que termine la funcion 
                await new Promise(reject => {
                    let contador = 0;
                    // recorre los datos confirmados 
                    datosConfirmados.roles.map((permiso) => {
                        // comprueba que el permiso sea un MongoID
                        if (!isMongoId(permiso)) {
                            roleNotValid.push(permiso);
                            reject();
                        }
                        else {
                            // Busca en la base de datos el permiso
                            // Que tenga el id permiso y que no haya sido borrado logicamente.
                            const condicion = { _id: permiso, isActive: true };
                            Role.find(condicion).exec((err, roleDB) => {
                                // Si ocurrio un error
                                if (err) {
                                    roleNotFound.push(permiso);
                                }
                                // Si no se encontro
                                else if (!roleDB) {
                                    roleNotFound.push(permiso);
                                }
                                // Si no se encontro
                                else if (!toBoolean(roleDB.toString())) {
                                    roleNotFound.push(permiso);
                                }

                                // Aumenta el contador y comprueba si no termino de leer el arreglo
                                contador++;
                                if (contador >= datosConfirmados.roles.length) {
                                    reject();
                                }
                            });
                        }
                    });
                });

                // Si hay al menos un permiso no valido
                if (roleNotValid.length > 0) {
                    rejectGlobal(`the roles ID: ${roleNotValid.toString()} are not valid`.replace(',', ', '))
                }
                // Si hay al menos un permiso no encontrado en la DB
                else if (roleNotFound.length > 0) {
                    rejectGlobal(`the roles ID: ${roleNotFound.toString()} wasn't found in the db`.replace(',', ', '));
                }
                // Si no hubo ningun error, acepta la peticion
                else {
                    resolveGlobal();
                }
            }
            comprobacionDeExistencia();
        }).then(
            () => { // Si no hubo ningun error
                System.findOneAndUpdate({ _id: ID }, datosConfirmados, { new: true }).exec((err, systemDB) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            err,
                        });
                    }
                    else {
                        res.status(200).json({
                            ok: true,
                            role: systemDB,
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
    }
    else {
        System.findOneAndUpdate({ _id: ID }, datosConfirmados, { new: true }).exec((err, systemDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err,
                });
            }
            else {
                res.status(200).json({
                    ok: true,
                    role: systemDB,
                });
            }
        });
    }
    return;
});

server.get('/system', (req, res) => {
    const condicion = { isActive: true };
    System.find(condicion, { isActive: 0, __v: 0 }).exec((err, arraySystemDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraySystemDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'system not found' },
            });
        }
        else if (!toBoolean(arraySystemDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            System.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    systems: arraySystemDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/system/:ID', (req, res) => {
    const { ID } = req.params;
    System.findById(ID, { __v: 0 }).exec((err, systemDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!systemDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'system not found' },
            });
        }
        else if (!toBoolean(systemDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                system: systemDB,
            });
        }
    });
});

server.get('/systemDeleted', (req, res) => {
    const condicion = { isActive: false };
    System.find(condicion, { isActive: 0, __v: 0 }).exec((err, arraySystemDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arraySystemDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'system not found' },
            });
        }
        else if (!toBoolean(arraySystemDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            System.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    systems: arraySystemDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.delete('/system/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const borradoLogico = { isActive: false };

    System.findByIdAndUpdate(ID, borradoLogico, { new: true }).exec((err, systemDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!systemDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'system not found' },
            });
        }
        res.status(200).json({
            ok: true,
            system: systemDB,
        });
    });
});

module.exports = server;
