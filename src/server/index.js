//package
const http = require('http');
const path = require('path');

//local
const app = require('./app');
const config = require('../../config/server');


//app
const port = process.env.PORT || config.port;
const server = http.createServer(app.callback())

server.listen(port, async () => {
	console.log(` >>> server listen on http://localhost:${port}`);
});