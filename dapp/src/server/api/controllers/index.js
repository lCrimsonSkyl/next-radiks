import express from 'express';
const server = express();

server.use(require('./permission'));
server.use(require('./role'));
server.use(require('./system'));
server.use(require('./language'));
server.use(require('./company'));
server.use(require('./city'));
server.use(require('./state'));
server.use(require('./country'));
server.use(require('./user'));
// server.use(require('./authentication'));

module.exports = server;