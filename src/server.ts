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
import { LecturerController } from "./controller/LecturerController"
import { UserController } from "./controller/UserController"
import { LectureHallController } from "./controller/LectureHallController"
import { GeneralController } from "./controller/GeneralController"
import { LectureController } from "./controller/LectureController"
import { AttendanceController } from "./controller/AttendanceController"
import { RegexPatternUtil } from "./util/RegexPatternUtil"
import { AuthController } from "./controller/AuthController"
import { LecturerCourseController } from "./controller/LecturerCourseController"

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
Express.js & Socket.io
=====================================================================================
*/

// method used for checking permissions
const isAuthorized = AuthController.isAuthorized;

// Express.js: Initialize
const app = express();

// Socket.io: Initialize
const server = require("http").createServer(app);
const io = require("socket.io")(server);

// Express.js: Parse json request bodies
app.use(express.json({
   limit: "8000kb"
}));

// Express.js: Register session middleware
const sessionMiddleware = session({
   secret: process.env.SESSION_SECRET,
   saveUninitialized: false,
   resave: false
});

app.use(sessionMiddleware);

// Socket.IO: Register session middleware
io.use((socket, next) => {
   sessionMiddleware(socket.request, {}, next);
});

// changes for development environment
if (process.env.PRODUCTION == "false") {
   // enable CORS
   app.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
   });

   // dummy session data
   app.use((req, res, next) => {
      req.session.data = {
         username: "admin",
         logged: true,
         userRoles: [{ id: 1 }],
         userId: 1
      };
      next();
   });
}

// Express.js: Folder with static HTML files to server the user
app.use("/", express.static(`${__dirname}/../../Frontend`));

/* 
=====================================================================================
Routes
=====================================================================================
*/

// Routes: Authentication Routes
app.route("/api/login")
   .post((req, res) => {
      AuthController.logIn(req.session, req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/logout")
   .get((req, res) => {
      AuthController.logOut(req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

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

// Routes:  Lecturer Routes
app.route("/api/lecturers")
   .post((req, res) => {
      LecturerController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      LecturerController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LecturerController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LecturerController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Lecturer courses
app.route("/api/lecturer/courses")
   .get((req, res) => {
      LecturerCourseController.getCourses(req.query.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes:  Lecturer lectures
app.route("/api/lecturer/lectures")
   .post((req, res) => {
      LecturerCourseController.saveLecture(req.body.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      LecturerCourseController.getLectures(req.query.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LecturerCourseController.updateLecture(req.body.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LecturerCourseController.deleteLecture(req.body.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Users
app.route("/api/users")
   .post((req, res) => {
      UserController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      UserController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      UserController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      UserController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Lectures
app.route("/api/lectures")
   .post((req, res) => {
      LectureController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      LectureController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LectureController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LectureController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Lecture Eligibility check for start making attendace 
app.route("/api/lecture/check")
   .get((req, res) => {
      LecturerCourseController.checkLectureMarkingEligibility(req.query.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

// Routes:  Lecture Halls
app.route("/api/lecture_halls")
   .post((req, res) => {
      LectureHallController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .get((req, res) => {
      LectureHallController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LectureHallController.update(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LectureHallController.delete(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes: Attendance
app.route("/api/attendances")
   .post((req, res) => {
      AttendanceController.markAttendance(req.session, req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Regexes
app.route("/api/regexes")
   .get((req, res) => {
      RegexPatternUtil.getModuleRegex(req.query.data.module)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  General routes for data tables
app.route("/api/general")
   .get((req, res) => {
      GeneralController.get(req.query.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Socket.IO: namespace for attendance marking view
const attendanceNamespace = io.of("/api/attendance");

attendanceNamespace.on("connection", (socket) => {
   const lectureId = socket.handshake.query.lecture_id;
   const socketId = socket.id;

   AttendanceController.startMarking(lectureId, socketId, attendanceNamespace).catch(e => {
      console.log(e);
   });

   // attendanceNamespace.to(socketId).emit("qrcode", Math.floor((Math.random() * 1000) + 1));
   // setInterval(() => {
   //    attendanceNamespace.to(socketId).emit("qrcode", Math.floor((Math.random() * 1000) + 1));
   //    console.log("data send");
   // }, 5000);
});

// Express.js: Start the server
server.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));

// export app for testing
export default app;