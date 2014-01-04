var app      = require('../app');
var request  = require('supertest');
var login    = require('./login');
var mongoose = require('mongoose');
var assert = require('assert');

describe("Vision project API", function () {

    beforeEach(function (done) {

        mongoose.connection.collections['projects'].drop(function (err) {
            var proj = {
                name: 'test name',
                user: login.user,
                token: login.token,
                repositories: ['node-plates']
            };

            mongoose.connection.collections['projects'].insert(proj, function (err, docs) {
                id = docs[0]._id;
                done();
            });
        });
    });

    describe("when creating a new resource '/project'", function () {
        var project = {
            name: "New project new name",
            user: login.user,
            token: login.token,
            repositories: [
                "12345", "9898"
            ]
        };

        it("should respond with a 201 response code", function (done) {
            request(app).post('/project')
                .send(project)
                .expect('Content-Type', /json/)
                .expect(202)
                .end(function (err, res) {
                    var proj = JSON.parse(res.text);

                    assert.equal(proj.name, project.name);
                    assert.equal(proj.user, login.user);
                    assert.equal(proj.token, login.token);
                    assert.equal(proj.repositories[0], project.repositories[0]);
                    assert.equal(proj.repositories[1], project.repositories[1]);
                    assert.equal(res.header.location, '/project/' + proj._id);

                    done();
                });
        });
    });
});
