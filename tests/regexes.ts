import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/regexes";

// add delay until app is started
before(function (done) {
    setTimeout(function () {
        done();
    }, 2000);
});

describe("regexes: get regexes for a module", () => {
    it("should get regexes for STUDENT module", function (done) {
        chai
            .request(app)
            .get(`${ROUTE}?data[module]=STUDENT`)
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                expect(res.body.data).to.be.an("array", "response data should be an array of objects.");
                done();
            });
    });

    it("should send an error when given module not found", function (done) {
        chai
            .request(app)
            .get(`${ROUTE}?data[module]=DUAAA`)
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(false, "response status should be false.");
                done();
            });
    });

    it("should send an error when module is not provided", function (done) {
        chai
            .request(app)
            .get(`${ROUTE}?data=`)
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(false, "response status should be false.");
                done();
            });
    });
});