import express from 'express';
// import localHTTPS from 'https-localhost';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import next from 'next';
import morgan from 'morgan';
import path from 'path';

import { setup as radiskServerInstance } from 'radiks-server';

import redisClient from './redisClient';

import * as config from './config'; // Server config

const dev = process.env.NODE_ENV !== 'production';
// const nextInstance = next({ dev });
const nextInstance = next({ dir: './src/client', dev });
const nextHandler = nextInstance.getRequestHandler();

// Configuration imports

let server;


const startServer = async () => {
    // initalizing express instance.
    console.log('\nInitalizing Server Core'.cyan);

    server = express();
    // server = localHTTPS();
    console.log('Express instance: '.cyan + 'OK'.green);

    const corsOptions = {
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
    };

    const logger = morgan(':method :url :status :res[content-length] - :response-time ms');

    server.use(logger);

    // enable cors
    server.use(cors(corsOptions));
    console.log('CORS: '.cyan + 'OK'.green);

    // parse application/x-www-form-urlencoded
    server.use(bodyParser.urlencoded({ extended: false }));
    // parse application/json
    server.use(bodyParser.json());

    // ----------------------------------------------------------

    console.log('\nInitalizing Connection to DataBases'.cyan);

    // eslint-disable-next-line no-use-before-define
    const databasesConnection = await Promise.all([redisConnection(), mongoConnection()])
        .then((result) => result[0] && result[1]);

    if (!databasesConnection) {
        console.log('\nDatabases connection failed'.red);
        console.log('Terminating programm'.red);
        process.exit(1);
        return;
    }
    // ----------------------------------------------------------

    console.log('\nMounting Server Services'.cyan);

    console.log('Server Routes: '.cyan + 'OK'.green);

    await radiskServerInstance().then((RadiksController) => {
        server.use('/radiks', RadiksController);
        console.log('Radiks Server: '.cyan + 'OK'.green);
    }).catch((ex) => {
        console.log('Next instance: '.cyan + 'ERROR'.red);
        console.error(ex.stack);
        process.exit(1);
    });

    // eslint-disable-next-line global-require
    server.use(require('./api/controllers/index'));

    console.log('Server Services: '.cyan + 'OK'.green);


    // ----------------------------------------------------------

    console.log('\nMounting Client Services'.cyan);

    console.log('\nStarting Next instance'.cyan);

    await nextInstance.prepare().then(() => {
        console.log('Next instance: '.cyan + 'OK'.green);
    }).catch((ex) => {
        console.log('Next instance: '.cyan + 'ERROR'.red);
        console.error(ex.stack);
        process.exit(1);
    });

    // ----------------------------------------------------------
    console.log('\nMounting Client Routes'.cyan);

    server.get('/manifest.json', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.sendFile(path.join(__dirname, '..', 'client', 'static', 'manifest.json'));
    });

    server.get('/favicon.ico', (req, res) => {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', '*');
        res.sendFile(path.join(__dirname, '..', 'client', 'static', 'favicon.ico'));
    });

    server.get('*', (req, res) => nextHandler(req, res));

    console.log('Client Routes: '.cyan + 'OK'.green);

    // ----------------------------------------------------------

    server.listen(config.port, () => console.log(`\nServer is running in port ${config.port}... \n`.green));
};

let mongoConnection = () => new Promise((resolve, reject) => {
    const opciones = {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    };
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
        console.log('MongoDB connection: '.cyan + 'OK'.green);
        return true;
    },
    () => {
        console.log('MongoDB connection: '.cyan + 'ERROR'.red);
        return false;
    },
);

let redisConnection = () => new Promise((resolve, reject) => {
    redisClient.on('connect', () => {
        resolve();
    });

    redisClient.on('error', () => {
        reject();
    });
}).then(
    () => {
        console.log('RedisDB connection: '.cyan + 'OK'.green);
        return true;
    },
    () => {
        console.log('RedisDB connection: '.cyan + 'ERROR'.red);
        return false;
    },
);

startServer();
