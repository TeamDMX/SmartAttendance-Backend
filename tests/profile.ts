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

describe("profile: get the user profile of current session", () => {
    it("should get a profile with either student or lecturer containing an object", function (done) {
        chai
            .request(app)
            .get(`/api/profile`)
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                expect(res.body.data).to.be.an("object", "response data should be a single object.");
                done();
            });
    });
});