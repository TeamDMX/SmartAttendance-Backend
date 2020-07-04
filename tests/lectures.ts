import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/lectures";

// add delay until app is started
before(function (done) {
  setTimeout(function () {
    done();
  }, 2000);
});

describe("lectures: save", () => {
  it("should create a new lecture with id 99", function (done) {
    chai
      .request(app)
      .post(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "99",
          "code": "SP9876",
          "startDatetime": "2020-07-04 14:39:12",
          "allowedMins": "20",
          "lectureHallId": "1",
          "courseId": "1",
          "lectureStatusId":"1"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});


describe("lectures: get one", () => {
  it("should get the lecture info with id 99 as a object", function (done) {
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

describe("lectures: get all", () => {
  it("should get an array with lecture data objects", function (done) {
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

describe("lectures: delete", () => {
  it("should delete the lecture with id 99", function (done) {
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