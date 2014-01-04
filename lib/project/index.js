var ProjectSchema = require('../models').model('Project');

function Project() {}

Project.prototype.get = function (id, callback) {
    var query = { '_id': id };

    ProjectSchema.findOne(query, function (err, project) {
        if (err) return callback(err);

        return callback(null, project);
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

module.exports = Project;
