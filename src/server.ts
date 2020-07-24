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
import { ProfileController } from "./controller/ProfileController"
import { PrivilegeController } from "./controller/PrivilegeController"
import { AppAuthController } from "./controller/AppAuthController"

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
         logged: true,
         userRoles: [{ id: 1 }],
         userId: 1,
         lecturerId: 1,
         studentId: undefined
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

app.route("/api/app/register")
   .post((req, res) => {
      AppAuthController.registerStudent(req.session, req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Profile (Get the profile of currently logged in user)
app.route("/api/profile")
   .get((req, res) => {
      ProfileController.getOne(req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes:  Course Routes
app.route("/api/courses/search/:keyword/skip/:skip")
   .get((req, res) => {
      CourseController.getMany(req.params.keyword, parseInt(req.params.skip))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/courses")
   .post((req, res) => {
      CourseController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/courses/:courseId")
   .get((req, res) => {
      CourseController.getOne(parseInt(req.params.courseId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      CourseController.delete(parseInt(req.params.courseId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      CourseController.update(parseInt(req.params.courseId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Students Routes
app.route("/api/students/search/:keyword/skip/:skip")
   .get((req, res) => {
      StudentController.getMany(req.params.keyword, parseInt(req.params.skip))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/students")
   .post((req, res) => {
      StudentController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/students/:studentId")
   .get((req, res) => {
      StudentController.getOne(parseInt(req.params.studentId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      StudentController.delete(parseInt(req.params.studentId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      StudentController.update(parseInt(req.params.studentId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Lecturer Routes
app.route("/api/lecturers/search/:keyword/skip/:skip")
   .get((req, res) => {
      LecturerController.getMany(req.params.keyword, parseInt(req.params.skip))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lecturers")
   .post((req, res) => {
      LecturerController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lecturers/:lecturerId")
   .get((req, res) => {
      LecturerController.getOne(parseInt(req.params.lecturerId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LecturerController.delete(parseInt(req.params.lecturerId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LecturerController.update(parseInt(req.params.lecturerId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });



// Routes:  Lecturer Materials / Courses
app.route("/api/lecturers/:lecturerId/courses")
   .get((req, res) => {
      LecturerCourseController.getCourses(parseInt(req.params.lecturerId), req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lecturers/:lecturerId/courses/:courseId/lectures/search/:keyword/skip/:skip")
   .get((req, res) => {
      LecturerCourseController.getLectures(parseInt(req.params.lecturerId), parseInt(req.params.courseId), req.params.keyword, parseInt(req.params.skip), req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lecturers/:lecturerId/lectures/:lectureId")
   .get((req, res) => {
      LecturerCourseController.getLecture(parseInt(req.params.lecturerId), parseInt(req.params.lectureId), req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lecturers/:lecturerId/lectures")
   .post((req, res) => {
      LecturerCourseController.saveLecture(parseInt(req.params.lecturerId), req.body.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

app.route("/api/lecturers/:lecturerId/lectures/:lectureId")
   .put((req, res) => {
      LecturerCourseController.updateLecture(parseInt(req.params.lecturerId), parseInt(req.params.lectureId), req.body.data, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LecturerCourseController.deleteLecture(parseInt(req.params.lecturerId), parseInt(req.params.lectureId), req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// check if lecture is eligible to mark attendance
app.route("/api/lecturers/:lecturerId/lectures/:lectureId/check")
   .get((req, res) => {
      LecturerCourseController.checkLectureMarkingEligibility(parseInt(req.params.lecturerId), parseInt(req.params.lectureId), req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes:  Users
app.route("/api/users/search/:keyword/skip/:skip")
   .get((req, res) => {
      UserController.getMany(req.params.keyword, parseInt(req.params.skip))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/users")
   .post((req, res) => {
      UserController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/users/:userId")
   .get((req, res) => {
      UserController.getOne(parseInt(req.params.userId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      UserController.delete(parseInt(req.params.userId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      UserController.update(parseInt(req.params.userId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes: Role privileges
app.route("/api/roles/:roleId/privileges")
   .get((req, res) => {
      PrivilegeController.getOne(parseInt(req.params.roleId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      PrivilegeController.update(parseInt(req.params.roleId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Lectures
app.route("/api/lectures/search/:keyword/skip/:skip")
   .get((req, res) => {
      LectureController.getMany(req.params.keyword, parseInt(req.params.skip))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lectures")
   .post((req, res) => {
      LectureController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

app.route("/api/lectures/:lectureId")
   .get((req, res) => {
      LectureController.getOne(parseInt(req.params.lectureId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LectureController.delete(parseInt(req.params.lectureId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LectureController.update(parseInt(req.params.lectureId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  Lecture Halls
app.route("/api/lecture_halls/search/:keyword/skip/:skip")
   .get((req, res) => {
      LectureHallController.getMany(req.params.keyword, parseInt(req.params.skip))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


app.route("/api/lecture_halls")
   .post((req, res) => {
      LectureHallController.save(req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

app.route("/api/lecture_halls/:lectureHallId")
   .get((req, res) => {
      LectureHallController.getOne(parseInt(req.params.lectureHallId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .delete((req, res) => {
      LectureHallController.delete(parseInt(req.params.lectureHallId))
         .then(r => res.json(r))
         .catch(e => res.json(e));
   })

   .put((req, res) => {
      LectureHallController.update(parseInt(req.params.lectureHallId), req.body.data)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// Routes: Regexes
app.route("/api/regexes/:moduleName")
   .get((req, res) => {
      RegexPatternUtil.getModuleRegex(req.params.moduleName)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Routes:  General routes for data tables
app.route("/api/general/:tableName")
   .get((req, res) => {
      GeneralController.get(req.params.tableName)
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

// student attendances
app.route("/api/students/:regNumber/courses/:courseId/attendances")
   .get((req, res) => {
      AttendanceController.getStudentAttendance(req.params.regNumber, req.params.courseId)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });


// cancel and finish marking
app.route("/api/lecturers/:lecturerId/lectures/:lectureId/attendances/cancel")
   .get((req, res) => {
      AttendanceController.cancelMarking(req.params.lecturerId, req.params.lectureId, req.session)
         .then(r => res.json(r))
         .catch(e => {
            console.log(e);
            res.json(e);
         });
   });

app.route("/api/lecturers/:lecturerId/lectures/:lectureId/attendances/finish")
   .get((req, res) => {
      AttendanceController.finishMarking(req.params.lecturerId, req.params.lectureId, req.session)
         .then(r => res.json(r))
         .catch(e => res.json(e));
   });

// Socket.IO: namespace for attendance marking view
const attendanceNamespace = io.of("/api/mark_attendance");

attendanceNamespace.on("connection", (socket) => {
   const lectureId = socket.handshake.query.lecture_id;
   const socketId = socket.id;

   AttendanceController.startMarking(lectureId, socketId, attendanceNamespace).catch(e => {
      console.log(e);
   });
});

// Express.js: Start the server
server.listen(process.env.PORT, () => console.log(`Server is running on ${process.env.PORT}!`));

// export app for testing
export default app;