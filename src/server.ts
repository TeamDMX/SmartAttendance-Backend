/* 
=====================================================================================
DOTENV: Load settings from .env to process.env (see sample.env)
=====================================================================================
*/

require("dotenv").config();

/* 
=====================================================================================
Libraries
=====================================================================================
*/

// Libraries: 3rd Party
import { createConnection } from "typeorm";
import * as express from "express";
import * as session from "express-session";

/* 
=====================================================================================
Controllers
=====================================================================================
*/

import { CourseController } from "./controller/CourseController"
import { StudentController } from "./controller/StudentController"

/* 
=====================================================================================
Utilities
=====================================================================================
*/

// import { RegexPatternUtil } from "./util/RegexPatternUtil";

/* 
=====================================================================================
TypeORM
=====================================================================================
*/

// TypeORM: Create connection to the detabase
createConnection().then(() => {
   console.log("SUCESS: Database connected.");
}).catch(error => {
   console.log("ERROR: Database  connection failed.");
   throw Error(error);
});

/* 
=====================================================================================
Express.js
=====================================================================================
*/

// method used for checking permissions
// const isAuthorized = AuthController.isAuthorized;

// Express.js: Initialize
const app = express();

// Express.js: Parse json request bodies
app.use(express.json({
   limit: "8000kb"
}));

// Express.js: Sessions for login
app.use(session({
   secret: process.env.SESSION_SECRET,
   saveUninitialized: false,
   resave: false
}));

// enable CORS on development enviroment
if (process.env.PRODUCTION == "false") {
   app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
   });
}

// Express.js: Folder with static HTML files to server the user
app.use("/", express.static(`${__dirname}/../../public`));

// skip check for development enviroments
// app.use((req, res, next) => {
//    if (process.env.PRODUCTION == "false") {
//       req.session.data = {};
//       req.session.data.username = "admin";
//       req.session.data.logged = true;
//       req.session.data.userRoles = [{ id: 1 }, { id: 2 }];
//       req.session.data.userId = { id: 1 };
//    }
//    next();
// });

/* 
=====================================================================================
Routes
=====================================================================================
*/

// Routes:  Course Routes
app.route("/api/courses")
   .post((req, res) => {
      CourseController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      CourseController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      CourseController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      CourseController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Students Routes
app.route("/api/students")
   .post((req, res) => {
      StudentController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      StudentController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      StudentController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      StudentController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Express.js: Start the server
app.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));