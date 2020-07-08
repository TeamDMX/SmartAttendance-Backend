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

describe("lecture halls: save", () => {
  it("should create a new lecture hall with id 99", function (done) {
    chai
      .request(app)
      .post(`/api/lecture_halls`)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "99",
          "code": "EB-111",
          "name": "Mahara Hall"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});


describe("lecture halls: get one", () => {
  it("should get the lecture hall info with id 99 as a object", function (done) {
    chai
      .request(app)
      .get(`/api/lecture_halls/99`)
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

describe("lecture halls: get all", () => {
  it("should get an array with lecture hall data objects", function (done) {
    chai
      .request(app)
      .get(`/api/lecture_halls/search/ /0`)
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

describe("lecture halls: delete", () => {
  it("should delete the lecture hall with id 99", function (done) {
    chai
      .request(app)
      .delete(`/api/lecture_halls/99`)
      .set("content-type", "application/json; charset=utf-8")
      .send()
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});