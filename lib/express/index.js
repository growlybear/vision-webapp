
/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var config = require('../configuration');
var heartbeat = require('../routes/heartbeat');
var notFound = require('../middleware/notFound');

var app = express();

// all environments
app.set('port', config.get('express:port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());

app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.cookieParser('your secret here'));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// app.get('/', routes.index);
// app.get('/users', user.list);
app.get('/heartbeat', heartbeat.index);

// handle all undefined routes
app.use(notFound.index);


http.createServer(app).listen(app.get('port'), function () {
    if ('development' === app.get('env')) {
        console.log('Express server listening on port ' + app.get('port'));
    }
});


// exporting here allows us to test with supertest
module.exports = app;
