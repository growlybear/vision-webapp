var logger = require('../logger');
var Str = require('string');
var login = require('../../test/login');
var ProjectService = require('../project');
var Project = new ProjectService();

exports.get = function (req, res) {
    logger.info('Request.', req.url);

    Project.get(req.params.id, function (err, project) {
        if (err) return res.json(500, 'Internal Server Error');
        if (project == null) return res.json(404, 'Not Found');

        return res.json(200, project);
    });
};

exports.post = function (req, res) {
    var bname = req.body.name;

    logger.info('Post.', bname);

    if ( Str(bname).isEmpty() ) {
        return res.json(400, 'Bad request');
    }

    req.body.user = login.user;
    req.body.token = login.token;

    Project.post(bname, req.body, function (err, project) {
        if (err) return res.json(500, 'Internal Server Error');
        // TODO better error handling for conflicting projects
        //      null is returned to this method if the project already
        //      exists in the database
        if (project == null) return res.json(409, 'Conflict');

        res.location('/project/' + project._id);
        return res.json(201, project);
    })
};

exports.put = function (req, res) {
    logger.info('Put.', req.params.id);

    if ( Str(req.body.name).isEmpty() ) {
        return res.json(400, 'Bad Request');
    }

    req.body.user = login.user;
    req.body.token = login.token;

    Project.put(req.params.id, req.body, function (err, project) {
        if (err) return res.json(500, 'Internal Server Error');
        if (project == null) return res.json(404, 'Not Found');

        return res.json(204, 'No Content');
    });
};

exports.del = function (req, res) {
    logger.info('Delete.', req.params.id);

    Project.del(req.params.id, function (err, project) {
        //FIXME none of this error handling is tested
        if (err) return res.json(500, 'Internal Server Error');
        if (project == null) return res.json(404, 'Not Found');

        return res.json(204, 'No Content');
    });
};
