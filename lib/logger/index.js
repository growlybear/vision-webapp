var winston = require('winston');
var config = require('../configuration');


function Logger() {
    // Remove console logging, which pollutes test output on the console and,
    // worse, in coverage tests creates invalid HTML by inserting console log
    // messages above the DOCTYPE declaration of the created file
    // TODO remove this only in TEST and COVERAGE environments
    winston.remove(winston.transports.Console);

    // Configure winston's file
    return winston.add(winston.transports.File, {
        filename: config.get('logger:filename'),
        maxsize: 1048576,
        maxFiles: 3,
        level: config.get('logger:level')
    });
}

module.exports = new Logger();
