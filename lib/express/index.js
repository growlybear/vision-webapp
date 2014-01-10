/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');

var config = require('../configuration');
var db = require('../db');  // jshint -W098:true
var routes = require('../routes');

var notFound = require('../middleware/notFound');
var id = require('../middleware/id');

var app = express();

// all environments
app.set('port', config.get('express:port'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.param('id', id.validate);

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

app.get('/heartbeat', routes.heartbeat.index);

app.get( '/project',     routes.project.all);
app.post('/project',     routes.project.post);
app.get( '/project/:id', routes.project.get);
app.put( '/project/:id', routes.project.put);
app.del( '/project/:id', routes.project.del);

app.get( '/project/:id/repos',   routes.github.repos);
app.get( '/project/:id/commits', routes.github.commits);
app.get( '/project/:id/issues',  routes.github.issues);

// handle all undefined routes
app.use(notFound.index);


http.createServer(app).listen(app.get('port'), function () {
    if ('development' === app.get('env')) {
        console.log('Express server listening on port ' + app.get('port'));
    }
});


// exporting here allows us to test with supertest
module.exports = app;
