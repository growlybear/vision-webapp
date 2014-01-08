var ProjectSchema = require('../models').model('Project');
var GitHubRepo = require('../github');
var _ = require('underscore');


function Project() {}

Project.prototype.get = function (id, callback) {
    var query = { '_id': id };

    ProjectSchema.findOne(query, function (err, project) {
        if (err) return callback(err);

        return callback(null, project);
    });
};

Project.prototype.all = function (id, callback) {
    var query = { 'user': id };

    ProjectSchema.find(query, function (err, projects) {
        if (err) return callback(err);

        return callback(null, projects);
    });
};

Project.prototype.post = function (name, data, callback) {
    var query = { 'name': name };
    var project = new ProjectSchema(data);

    ProjectSchema.findOne(query, function (err, proj) {
        if (err) return callback(err);

        // Project names are currently unique, therefore one shouldn't be found
        if (proj != null) return callback(null, null);

        project.save(function (err, p) {
            if (err) return callback(err);
            return callback(null, p);
        });
    });
};

Project.prototype.put = function (id, update, callback) {
    var query = { '_id': id };
    delete update._id;

    ProjectSchema.findOne(query, function (err, project) {
        if (err) return callback(err);
        if (project == null) return callback(null, null);

        ProjectSchema.update(query, update, function (e) {
            if (e) return callback(e);
            return callback(null, {});  // ??
        });
    });
};

Project.prototype.del = function (id, callback) {
    var query = { '_id': id };

    ProjectSchema.findOne(query, function (err, project) {
        if (err) return callback(err);
        if (project == null) return callback(null, null);

        project.remove(function (e) {
            if (e) return callback(e);
            return callback(null, {});
        });
    });
};

Project.prototype.repos = function (id, callback) {
    ProjectSchema.findOne({ _id: id }, function (err, project) {
        if (err) return callback(err);
        if (project == null) return callback(null, null);

        var git = new GitHubRepo(project.token, project.user);

        git.repositories(function (err, response) {
            if (err) return callback(err);
            if (response == null) return callback('error', null);   // ??

            var items = response.map(function (model) {
                var item = _.pick(model, ['id', 'name', 'description']);
                var enabled = _.find(project.repositories, function (p) {
                    return p === item.name;
                });
                var attr = enabled ? 'checked' : '';
                item.enabled = attr;

                return item;
            });

            return callback(null, items);
        });
    });
};


module.exports = Project;
