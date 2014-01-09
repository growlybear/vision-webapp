var app      = require('../app');
var request  = require('supertest');
var login    = require('./login');
var mongoose = require('mongoose');
var assert = require('assert');
var _ = require('underscore');


describe("GitHub API integration", function () {

    var id;

    beforeEach(function (done) {

        mongoose.connection.collections['projects'].drop(function (err) {
            if (err) throw err;

            var proj = {
                name: 'Test Name',
                user: login.user,
                token: login.token,
                // NOTE need to work against a real repo with commits, ie. this one
                repositories: ['vision-webapp']
            };

            mongoose.connection.collections['projects'].insert(proj, function (err, docs) {
                id = docs[0]._id;
                done();
            });
        });
    });

    describe("when requesting an available resource '/project/:id/repos", function () {
        it("should respond with 200", function (done) {
            this.timeout(5000);
            request(app).get('/project/' + id + '/repos')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    var repo = _.first(JSON.parse(res.text));

                    assert(_.has(repo, 'id'));
                    assert(_.has(repo, 'name'));
                    assert(_.has(repo, 'description'));

                    done();
                });
        });
    });

    describe("when requesting an available resource '/project/:id/commits", function () {
        it("should respond with 200", function (done) {
            this.timeout(5000);
            request(app).get('/project/' + id + '/commits')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    var commit = _.first(JSON.parse(res.text));

                    assert(_.has(commit, 'message'));
                    assert(_.has(commit, 'date'));
                    assert(_.has(commit, 'login'));
                    assert(_.has(commit, 'avatar_url'));
                    assert(_.has(commit, 'ago'));
                    assert(_.has(commit, 'repository'));

                    done();
                });
        });
    });

    describe("when requesting an available resource '/project/:id/issues", function () {
        it("should respond with 200", function (done) {
            this.timeout(5000);
            request(app).get('/project/' + id + '/issues')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    var issue = _.first(JSON.parse(res.text));

                    assert(_.has(issue, 'title'));
                    assert(_.has(issue, 'state'));
                    assert(_.has(issue, 'updated_at'));
                    assert(_.has(issue, 'login'));
                    assert(_.has(issue, 'ago'));
                    assert(_.has(issue, 'repository'));

                    done();
                });
        });
    });
});
