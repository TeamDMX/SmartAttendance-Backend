import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/users";

// add delay until app is started
before(function (done) {
  setTimeout(function () {
    done();
  }, 2000);
});

describe("users: save", () => {
  it("should create a new user with id 99", function (done) {
    chai
      .request(app)
      .post(ROUTE)
      .set("content-type", "application/json; charset=utf-8")
      .send({
        "data": {
          "id": "99",
          "email": "kasun@kasun.com",
          "password": "admin",
          "roleIds": ["1"],
          "userTypeId": "1",
          "lecturerId": "1"
        }
      })
      .end(function (err, res) {
        if (err) done(err);
        expect(res.body.status).to.equal(true, "response status should be true.");
        done();
      });
  });
});


describe("users: get one", () => {
  it("should get the user info with id 99 as a object", function (done) {
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

describe("users: get all", () => {
  it("should get an array with user data objects", function (done) {
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

describe("users: delete", () => {
  it("should delete the user with id 99", function (done) {
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