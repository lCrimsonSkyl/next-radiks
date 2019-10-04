import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';

import mongoose from 'mongoose';
import redisClient from './redisClient';

import next from 'next';

const dev = process.env.NODE_ENV !== 'production'
// const nextInstance = next({ dev });
const nextInstance = next({ dir: './src/client', dev });
const nextHandler = nextInstance.getRequestHandler();

// Configuration imports
import * as config from './config'; // Server config

let server;

const startServer = async () => {

    // initalizing express instance.
    console.log("\nInitalizing Server Core".cyan);

    server = express();
    console.log("Express instance: ".cyan + "OK".green);

    const corsOptions = {
        origin: 'http://www.jonathan.com',
        optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
    }
    // enable cors
    server.use(cors(corsOptions));
    console.log("CORS: ".cyan + "OK".green);

    // parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    server.use(bodyParser.json());

    console.log("\nInitalizing Connection to DataBases".cyan);

    const databasesConnection = await Promise.all([redisConnection(), mongoConnection()]).then((result) => {
        return result[0] && result[1];
    });

    if (!databasesConnection) {
        console.log("\nDatabases connection failed".red);
        console.log("Terminating programm".red);
        process.exit(1);
        return;
    }

    console.log("\nMounting Server Services".cyan);

    server.use(require('./api/controllers/index'));

    console.log("Server Services: ".cyan + "OK".green);

    console.log("\nMounting Client Services".cyan);
    console.log("\nStarting Next instance".cyan);

    await nextInstance.prepare().then(() => {
        console.log("Next instance: ".cyan + "OK".green);
    }).catch((ex) => {
        console.log("Next instance: ".cyan + "ERROR".red);
        console.error(ex.stack);
        process.exit(1)
    });

    console.log("\nMounting Client Routes".cyan);
    server.get('*', (req, res) => {
        return nextHandler(req, res);
    });
    console.log("Client Routes: ".cyan + "OK".green);

    server.listen(config.port, () => console.log(`\nServer is running in port ${config.port}... \n`.green));
}

var mongoConnection = () => {
    return new Promise((resolve, reject) => {
        const opciones = { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false, useUnifiedTopology: true };
        mongoose.connect(config.urlDB, opciones, (err) => {
            if (!err) {
                resolve();
            }
            else {
                reject();
            }
        });
    }).then(
        () => {
            console.log('MongoDB connection: '.cyan + "OK".green);
            return true;
        }
        ,
        () => {
            console.log('MongoDB connection: '.cyan + "ERROR".red);
            return false;
        }
    )
};

var redisConnection = () => {
    return new Promise((resolve, reject) => {
        redisClient.on('connect', function () {
            resolve();
        });

        redisClient.on('error', function (err) {
            reject();
        });
    }).then(
        () => {
            console.log('RedisDB connection: '.cyan + "OK".green);
            return true;
        },
        () => {
            console.log('RedisDB connection: '.cyan + "ERROR".red);
            return false;
        }
    )
};

startServer();

// Habilita las api back-end al servidor


