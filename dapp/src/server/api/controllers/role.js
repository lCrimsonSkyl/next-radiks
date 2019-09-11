import express from 'express';
import { toBoolean, isMongoId } from 'validator';

import Role from '../models/role';
import Permission from '../models/permission';

const server = express();

server.post('/role', (req, res) => {
    const datosEsperados = [
        'name', 'description', 'permissions'
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

    // Se hace toda la siguiente comprobacion en una promesa, debido a problemas con el manejo de
    // procedimientos asincronos.
    new Promise((resolveGlobal, rejectGlobal) => {
        // Si fue entregado un string, se comprueba que corresponda a un MongoID
        // Si no lo es, se rechaza la peticion
        // Si lo es, transforma el dato en un Array de string [ String ]
        // que luego será procesado por comprobacionDeExistencia()
        if (typeof datosConfirmados.permissions === 'string') {
            if (!isMongoId(datosConfirmados.permissions)) {
                rejectGlobal(`the permission ID: ${datosConfirmados.permissions} is not valid`.replace(',', ', '));
            }
            else {
                datosConfirmados.permissions = [datosConfirmados.permissions];
            }
        }
        // Se crean arreglos vacios que almacenen los datos erroneos que se detecten.
        let permisosNoValidos = [];
        const permissionNotFound = [];

        // Se eliminan permisos duplicados aprovechando la propiedad Unique del tipo de variable Set.
        const permisosRecibidos = new Set(datosConfirmados.permissions);
        datosConfirmados.permissions = [...permisosRecibidos];

        const comprobacionDeExistencia = async () => {
            // Pausa la ejecucion del proceso hasta que termine la funcion 
            await new Promise(reject => {
                let contador = 0;
                // recorre los datos confirmados 
                datosConfirmados.permissions.map((permiso) => {
                    // comprueba que el permiso sea un MongoID
                    if (!isMongoId(permiso)) {
                        permisosNoValidos.push(permiso);
                        reject();
                    }
                    else {
                        // Busca en la base de datos el permiso
                        // Que tenga el id permiso y que no haya sido borrado logicamente.
                        const condicion = { _id: permiso, isActive: true };
                        Permission.find(condicion).exec((err, permissionDB) => {
                            // Si ocurrio un error
                            if (err) {
                                permissionNotFound.push(permiso);
                            }
                            // Si no se encontro
                            else if (!permissionDB) {
                                permissionNotFound.push(permiso);
                            }
                            // Si no se encontro
                            else if (!toBoolean(permissionDB.toString())) {
                                permissionNotFound.push(permiso);
                            }

                            // Aumenta el contador y comprueba si no termino de leer el arreglo
                            contador++;
                            if (contador >= datosConfirmados.permissions.length) {
                                reject();
                            }
                        });
                    }
                });
            });

            // Si hay al menos un permiso no valido
            if (permisosNoValidos.length > 0) {
                rejectGlobal(`the permissions ID: ${permisosNoValidos.toString()} are not valid`.replace(',', ', '))
            }
            // Si hay al menos un permiso no encontrado en la DB
            else if (permissionNotFound.length > 0) {
                rejectGlobal(`the permissions ID: ${permissionNotFound.toString()} 
                wasn't found in the db`.replace(',', ', '));
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
            const role = new Role(datosConfirmados);
            role.save((err, roleDB) => {
                if (err) {
                    res.status(400).json({
                        ok: false,
                        err,
                    });
                }
                else {
                    res.status(200).json({
                        ok: true,
                        role: roleDB,
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

server.put('/role/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const datosEsperados = [
        'name', 'description', 'permissions'
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
    else if (datosConfirmados.permissions) {
        // Si fue entregado un string, se comprueba que corresponda a un MongoID
        // Si no lo es, se rechaza la peticion
        // Si lo es, transforma el dato en un Array de string [ String ]
        // que luego será procesado por comprobacionDeExistencia()
        if (typeof datosConfirmados.permissions === 'string') {
            if (!isMongoId(datosConfirmados.permissions)) {
                res.status(400).json({
                    ok: false,
                    err: {
                        message: `the permission ID: ${datosConfirmados.permissions} 
                    is not valid`.replace(',', ', ')
                    },
                });
                return;
            }
            else {
                datosConfirmados.permissions = [datosConfirmados.permissions];
            }
        }
        new Promise((resolveGlobal, rejectGlobal) => {
            // Si al menos un parametro recibido no era de los esperados

            // Se crean arreglos vacios que almacenen los datos erroneos que se detecten.
            let permisosNoValidos = [];
            const permissionNotFound = [];

            // Se eliminan permisos duplicados aprovechando la propiedad Unique del tipo de variable Set.
            const permisosRecibidos = new Set(datosConfirmados.permissions);
            datosConfirmados.permissions = [...permisosRecibidos];

            const comprobacionDeExistencia = async () => {
                // Pausa la ejecucion del proceso hasta que termine la funcion 
                await new Promise(reject => {
                    let contador = 0;
                    // recorre los datos confirmados 
                    datosConfirmados.permissions.map((permiso) => {
                        // comprueba que el permiso sea un MongoID
                        if (!isMongoId(permiso)) {
                            permisosNoValidos.push(permiso);
                            reject();
                        }
                        else {
                            // Busca en la base de datos el permiso
                            // Que tenga el id permiso y que no haya sido borrado logicamente.
                            const condicion = { _id: permiso, isActive: true };
                            Permission.find(condicion).exec((err, permissionDB) => {
                                // Si ocurrio un error
                                if (err) {
                                    permissionNotFound.push(permiso);
                                }
                                // Si no se encontro
                                else if (!permissionDB) {
                                    permissionNotFound.push(permiso);
                                }
                                // Si no se encontro
                                else if (!toBoolean(permissionDB.toString())) {
                                    permissionNotFound.push(permiso);
                                }

                                // Aumenta el contador y comprueba si no termino de leer el arreglo
                                contador++;
                                if (contador >= datosConfirmados.permissions.length) {
                                    reject();
                                }
                            });
                        }
                    });
                });

                // Si hay al menos un permiso no valido
                if (permisosNoValidos.length > 0) {
                    rejectGlobal(`the permissions ID: ${permisosNoValidos.toString()} are not valid`.replace(',', ', '))
                }
                // Si hay al menos un permiso no encontrado en la DB
                else if (permissionNotFound.length > 0) {
                    rejectGlobal(`the permissions ID: ${permissionNotFound.toString()} 
                    wasn't found in the db`.replace(',', ', '));
                }
                // Si no hubo ningun error, acepta la peticion
                else {
                    resolveGlobal();
                }
            }
            comprobacionDeExistencia();
        }).then(
            () => { // Si no hubo ningun error
                Role.findOneAndUpdate({ _id: ID }, datosConfirmados, { new: true }).exec((err, roleDB) => {
                    if (err) {
                        res.status(400).json({
                            ok: false,
                            err,
                        });
                    }
                    else {
                        res.status(200).json({
                            ok: true,
                            role: roleDB,
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
        Role.findOneAndUpdate({ _id: ID }, datosConfirmados, { new: true }).exec((err, roleDB) => {
            if (err) {
                res.status(400).json({
                    ok: false,
                    err,
                });
            }
            else {
                res.status(200).json({
                    ok: true,
                    role: roleDB,
                });
            }
        });
    }
    return;
});

server.get('/role/:ID', (req, res) => {
    const { ID } = req.params;
    Role.findById(ID, { __v: 0 }).populate('permissions', '_id name description').exec((err, roleDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!roleDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'role not found' },
            });
        }
        else if (!toBoolean(roleDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            res.json({
                ok: true,
                permision: roleDB,
            });
        }
    });
});

server.get('/role', (req, res) => {
    const condicion = { isActive: true };
    Role.find(condicion, { isActive: 0, __v: 0, permissions: 0 }).exec((err, arrayRoleDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayRoleDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'role not found' },
            });
        }
        else if (!toBoolean(arrayRoleDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Role.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    roles: arrayRoleDB,
                    cuantos: conteo,
                });
            });
        }
    });
});

server.get('/roleDeleted', (req, res) => {
    const condicion = { isActive: false };
    Role.find(condicion, { isActive: 0, __v: 0 }).exec((err, arrayRoleDB) => {
        if (err) {
            res.status(400).json({
                ok: false,
                err,
            });
        }
        else if (!arrayRoleDB) {
            res.status(400).json({
                ok: false,
                err: { message: 'role not found' },
            });
        }
        else if (!toBoolean(arrayRoleDB.toString())) {
            res.status(404).json({
                ok: false,
                err: { message: 'document not found' },
            });
        }
        else {
            Role.countDocuments(condicion, (error, conteo) => {
                res.json({
                    ok: true,
                    permisions: arrayRoleDB,
                    total: conteo,
                });
            });
        }
    });
});

server.delete('/role/:ID', (req, res) => {
    const { ID } = req.params;

    if (!isMongoId(ID)) {
        res.status(400).json({
            ok: false,
            err: { message: 'the ID is not valid' },
        });
        return;
    }

    const borradoLogico = { isActive: false };

    Role.findByIdAndUpdate(ID, borradoLogico, { new: true }).exec((err, roleDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err,
            });
        }
        if (!roleDB) {
            return res.status(400).json({
                ok: false,
                err: { message: 'role not found' },
            });
        }
        res.status(200).json({
            ok: true,
            role: roleDB,
        });
    });
});

module.exports = server;
