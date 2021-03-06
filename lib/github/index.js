var GitHubApi = require('github');
// var config = require('../configuration');
var async = require('async');
var moment = require('moment');
var _ = require('underscore');


function GitHubRepo(token, user) {
    this.token = token;
    this.user = user;

    this.github = new GitHubApi({
        version: '3.0.0',
        timeout: 5000
    });

    this.github.authenticate({
        type: 'oauth',
        token: token
    });
}

GitHubRepo.prototype.repositories = function (callback) {
    this.github.repos.getAll({}, function (err, res) {
        if (err) return callback (err);
        if (res == null) return callback(null, null);

        var items = res.map(function (model) {
            return _.pick(model, ['id', 'name', 'description']);
        });

        callback(null, items);
    });
};

GitHubRepo.prototype.commits = function (repos, callback) {
    var self = this,
        items = [];

    async.each(repos, function (repo, callback) {
        self.github.repos.getCommits({
            user: self.user,
            repo: repo
        }, function (err, res) {
            if (err) return callback(err);
            if (res == null) return callback();

            var repoItems = res.map(function (model) {
                var item = _.pick(model.commit, ['message']);

                if (model.commit && model.commit.committer) {
                    _.extend(item, _.pick(model.commit.committer, ['date']));
                }
                if (model.committer) {
                    _.extend(item, _.pick(model.committer, ['login', 'avatar_url']));
                }

                item.ago = moment(item.date).fromNow();
                item.repository = repo;

                return item;
            });

            items = _.union(items, repoItems);

            callback(null, items);
        });
    }, function (err) {
        var top = _.chain(items)
            .sortBy(function (item) { return item.date; })
            .reverse()
            .first(10)
            .value();

        callback(err, top);
    });
};

GitHubRepo.prototype.issues = function (repos, callback) {
    var self = this,
        items = [];

    /*jshint camelcase:false */
    async.each(repos, function (repo, callback) {
        self.github.issues.repoIssues({
            user: self.user,
            repo: repo
        }, function (err, response) {
            if (err) return callback();
            if (response == null) return callback();

            var repoItems = response.map(function (model) {
                var item = _.pick(model, ['title', 'state', 'updated_at']);

                if (model.user) {
                    _.extend(item, _.pick(model.user, ['login', 'avatar']));
                }

                item.ago = moment(item.updated_at).fromNow();
                item.repository = repo;

                return item;
            });

            items = _.union(items, repoItems);
            callback(null, items);
        });
    }, function (err) {
        var top = _.chain(items)
            .sort(function (item) { return item.updated_at; })
            .reverse()
            .first(10)
            .value();

        callback(err, top);
    });
    /*jshint camelcase:true */
};

module.exports = GitHubRepo;
