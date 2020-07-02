import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/students";

// add delay until app is started
before(function (done) {
  setTimeout(function () {
    done();
  }, 2000);
});

describe("students: save", () => {
  it("should create a new student with id 1", function (done) {
    chai
      .request(app)
      .post(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "1",
          "regNumber": "TE98765",
          "fullName": "Dasun Dalaml",
          "indexNumber": "ICT/18/811"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});


describe("students: get one", () => {
  it("should get the student info with id 1 as a object", function (done) {
    chai
      .request(app)
      .get("/api/students?data[id]=1")
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

describe("students: get all", () => {
  it("should get an array with student data objects", function (done) {
    chai
      .request(app)
      .get(ROUTE)
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

describe("students: delete", () => {
  it("should delete the student with id 1", function (done) {
    chai
      .request(app)
      .delete(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "1",
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});