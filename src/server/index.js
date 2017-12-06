//package
const http = require('http');
const path = require('path');
const mongoose = require('mongoose');

//local
const app = require('./app');
const config = require('../../config/server');
const allRouter = require('./routes/index.js');

//utils
const { getCookie, getUrl } = require('./utils/get')

//app
const port = process.env.PORT || config.port;
const server = http.createServer(app.callback())

server.listen(port, async () => {
	console.log(` >>> server listen on http://localhost:${port}`);
});