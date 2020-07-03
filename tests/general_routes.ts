import app from "../src/server";
import * as chai from "chai";
import chaiHttp = require("chai-http");
import "mocha";

chai.use(chaiHttp);
const { expect } = chai;

// ROUTE to send requests (path)
const ROUTE = "/api/general";

// add delay until app is started
before(function (done) {
	setTimeout(function () {
		done();
	}, 2000);
});

describe("general: get table data", () => {
	it("should get all rows in role table", function (done) {
		chai
			.request(app)
			.get(`${ROUTE}?data[table]=role`)
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

describe("general: get table data from non-general table", () => {
	it("should send an error for student table", function (done) {
		chai
			.request(app)
			.get(`${ROUTE}?data[table]=student`)
			.set("content-type", "application/json; charset=utf-8")
			.send()
			.end(function (err, res) {
				if (err) done(err);
				expect(res.body.status).to.equal(false, "response status should be false.");
				done();
			});
	});

	it("should send an error for course table", function (done) {
		chai
			.request(app)
			.get(`${ROUTE}?data[table]=course`)
			.set("content-type", "application/json; charset=utf-8")
			.send()
			.end(function (err, res) {
				if (err) done(err);
				expect(res.body.status).to.equal(false, "response status should be false.");
				done();
			});
	});

	it("should send an error for a non-existing table", function (done) {
		chai
			.request(app)
			.get(`${ROUTE}?data[table]=aafdasdad`)
			.set("content-type", "application/json; charset=utf-8")
			.send()
			.end(function (err, res) {
				if (err) done(err);
				expect(res.body.status).to.equal(false, "response status should be false.");
				done();
			});
	});
});
