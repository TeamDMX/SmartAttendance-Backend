import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/courses";

// add delay until app is started
before(function (done) {
  setTimeout(function(){
    done();
  }, 2000);
});

describe("Courses: Save", () => {
  it("should create a new course with id 1", function (done) {
    chai
      .request(app)
      .post(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "1",
          "code": "ITC111",
          "name": "Introduction to Programming"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "Response status should be true.");
        done();
      });
  });
});


describe("Courses: GetOne", () => {
  it("should get the course info with id 1 as a object", function (done) {
    chai
      .request(app)
      .get("/api/courses?data[id]=1")
      .set("content-type", "application/json; charset=utf-8")
      .send()
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "Response status should be true.");
        expect(res.body.data).to.be.an("object", "Response data should be a single object");
        done();
      });
  });
});

describe("Courses: GetAll", () => {
  it("should get an array with course data objects", function (done) {
    chai
      .request(app)
      .get(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send()
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "Response status should be true.");
        expect(res.body.data).to.be.an("array", "Response data should be an array of objects.");
        done();
      });
  });
});

describe("Courses: Delete", () => {
  it("should delete the course with id 1", function (done) {
    chai
      .request(app)
      .delete(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "1",
          "code": "ITC111",
          "name": "Introduction to Programming"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "Response status should be true.");
        done();
      });
  });
});