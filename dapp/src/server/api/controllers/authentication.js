import express from 'express';
import uuidv4 from 'uuid/v4';
import request from 'request';
import { toBoolean, isMongoId, isEmail } from 'validator';

import redisClient from '../../redisClient';

import { tokenExp, privateKey } from '../../config';

const server = express();

server.post('/login', (req, res) => {
    res.status(200).json({
        ok: true,
    });
});

server.post('/register', (req, res) => {
    res.status(200).json({
        ok: true,
    });
});

server.get('/confirmEmail/:UUID', (req, res) => {
    res.status(200).json({
        ok: true,
    });
})

module.exports = server;