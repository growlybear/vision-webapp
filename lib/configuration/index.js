var nconf = require('nconf');

function Config() {
    nconf.argv().env('_');

    var environment = nconf.get('NODE:ENV') || 'development';

    // load config based on the current environment
    nconf.file(environment, 'config/' + environment + '.json');
    // load non-environmental config
    nconf.file('default', 'config/default.json');
}

Config.prototype.get = function (key) {
    return nconf.get(key);
};

module.exports = new Config();
