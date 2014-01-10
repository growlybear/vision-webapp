var app = require('../app');
var request = require('supertest');
var assert = require('assert');
var cheerio = require('cheerio');


describe("Vision master page", function () {
    describe("when requesting resource '/'", function () {
        it("should respond with view", function (done) {
            request(app).get('/')
                .expect('Content-Type', /html/)
                .expect(200, done);
        });

        it("should display correct information", function (done) {
            request(app).get('/').end(function (err, res) {
                // FIXME break these tests out individually
                var $ = cheerio.load(res.text);

                // meta
                assert(
                    /^utf-8$/.test($('meta[charset]').attr('charset')) &&
                    /dashboard for GitHub$/.test($('meta[name=description]').attr('content')) &&
                    /^Michael Allan$/.test($('meta[name=author]').attr('content'))
                );
                // visible info
                assert($('title').html() === 'Vision App');
                assert($('html').attr('lang') === 'en');

                done();
            });
        });
    });
});
