var connect = require('connect');
var serveStatic = require('serve-static');
connect().use(serveStatic(__dirname)).listen(8085);
console.log("Qlik Sense Angular Demo Webserver now listening on port 8085")
