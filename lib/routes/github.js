var logger = require('../logger');
// var Str = require('string');
var ProjectService = require('../project');
var Project = new ProjectService();

exports.repos = function (req, res) {
    logger.info('Request.', req.url);

    Project.repos(req.params.id, function (err, repos) {
        if (err) return res.json(500, 'Internal Server Error');
        if (repos == null) return res.json(404, 'Not Found');

        return res.json(200, repos);
    });
};
