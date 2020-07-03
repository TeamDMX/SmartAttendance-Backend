import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/lecturers";

// add delay until app is started
before(function (done) {
  setTimeout(function () {
    done();
  }, 2000);
});

describe("lecturers: save", () => {
  it("should create a new lecturer with id 99", function (done) {
    chai
      .request(app)
      .post(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "99",
          "code": "12345",
          "name": "Dasun Dalaml",
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});


describe("lecturers: get one", () => {
  it("should get the lecturer info with id 99 as a object", function (done) {
    chai
      .request(app)
      .get(`${ROUTE}?data[id]=99`)
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

describe("lecturers: get all", () => {
  it("should get an array with lecturer data objects", function (done) {
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

describe("lecturers: delete", () => {
  it("should delete the lecturer with id 99", function (done) {
    chai
      .request(app)
      .delete(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "99",
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});