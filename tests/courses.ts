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

describe("courses: save", () => {
  it("should create a new course with id 99", function (done) {
    chai
      .request(app)
      .post("/api/courses")
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "99",
          "code": "ITC111",
          "name": "Introduction to Programming"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});


describe("courses: get one", () => {
  it("should get the course info with id 99 as a object", function (done) {
    chai
      .request(app)
      .get("/api/courses/99")
      .set("content-type", "application/json; charset=utf-8")
      .send()
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        expect(res.body.data).to.be.an("object", "response data should be a single object");
        done();
      });
  });
});

describe("courses: get all", () => {
  it("should get an array with course data objects", function (done) {
    chai
      .request(app)
      .get("/api/courses/search/ /skip/0")
      .set("content-type", "application/json; charset=utf-8")
      .send()
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        expect(res.body.data).to.be.an("array", "response data should be an array of objects.");
        done();
      });
  });
});

describe("courses: delete", () => {
  it("should delete the course with id 99", function (done) {
    chai
      .request(app)
      .delete("/api/courses/99")
      .set("content-type", "application/json; charset=utf-8")
      .send()
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});