import express from 'express';
const server = express();

server.use(require('./authentication'));

module.exports = server;