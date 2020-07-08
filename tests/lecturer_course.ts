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

describe("lecturer course: get courses", () => {
    it("should get courses belong to lecturer with id 1", function (done) {
        chai
            .request(app)
            .get(`/api/lecturer/1/courses`)
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                expect(res.body.data).to.be.an("array", "response data should be an array");
                done();
            });
    });
});

describe("lecturer course: get lectures", () => {
    it("should get lectures belong to course with id 1", function (done) {
        chai
            .request(app)
            .get(`/api/lecturer/1/courses/1/lectures`)
            .set("content-type", "application/json; charset=utf-8")
            .send()
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                expect(res.body.data).to.be.an("array", "response data should be an array");
                done();
            });
    });
});

describe("lecturer course: save lecture", () => {
    it("should create a lecture with id 99", function (done) {
        chai
            .request(app)
            .post(`/api/lecturer/1/lectures`)
            .set("content-type", "application/json; charset=utf-8")
            .send({
                "data": {
                    "id": "99",
                    "code": "SP9876",
                    "startDatetime": "2020-07-07T14:04:16.301Z",
                    "allowedMins": "20",
                    "lectureHallId": "1",
                    "courseId": "1",
                    "lectureStatusId": "1"
                }
            })
            .end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                done();
            });
    });
});


describe("lecturer course: delete lecture", () => {
    it("should delete the lecture with id 99", function (done) {
        chai
            .request(app)
            .delete(`/api/lecturer/1/lectures/99`)
            .set("content-type", "application/json; charset=utf-8")
            .send({
                "data": {
                    "id": "99"
                }
            }).end(function (err, res) {
                if (err) done(err);
                expect(res.body.status).to.equal(true, "response status should be true.");
                done();
            });
    });
});