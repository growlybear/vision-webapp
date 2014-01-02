var app     = require('../app');
var request = require('supertest');

describe("vision heartbeat api", function () {
    describe("when requesting resource '/heartbeat'", function () {
        it("should respond with a 200 response code", function (done) {
            request(app).get('/heartbeat')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });

    describe("when requesting resource '/missing'", function () {
        it("should respond with a 404 response code", function (done) {
            request(app).get('/missing')
                .expect('Content-Type', /json/)
                .expect(404, done);
        });
    });
});
