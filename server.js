const http=require ('http');
const app = require('./app');
/**
 * http package provide fonctionamlity for spinning up server
 * 
 */
const port =process.env.PORT || 3000;
const server =http.createServer(app);
server.listen(port);