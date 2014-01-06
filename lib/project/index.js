var ProjectSchema = require('../models').model('Project');

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


module.exports = Project;
