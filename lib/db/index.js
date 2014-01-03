var mongoose = require('mongoose');
var config = require('../configuration');

var url = config.get('mongo:url');
var options = {
    server: {
        auto_reconnect: true,
        poolSize: 10
    }
};

mongoose.connection.open(url, options);
