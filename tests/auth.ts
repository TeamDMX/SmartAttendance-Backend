import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// add delay until app is started
before(function (done) {
    setTimeout(function () {
        done();
    }, 2000);
});

describe("auth: log in & log out", () => {
    it("should login with the admin@admin.com email.", function (done) {
        chai
            .request(app)
            .post("/api/login")
            .set("content-type", "application/json; charset=utf-8")
            .send({
                "data": {
                    "username": "admin@admin.com",
                    "password": "admin",
                }
            })
            .end(function (err, res) {                
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                expect(res.body).to.be.an("object", "response data should be a single object");
                done();
            });
    });

    it("should log out", function (done) {
        chai
            .request(app)
            .get("/api/logout")
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                expect(res.body).to.be.an("object", "response data should be a single object");
                done();
            });
    });
});

