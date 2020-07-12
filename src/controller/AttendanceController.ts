require("dotenv").config();

import { getRepository } from "typeorm";
import { Attendance } from "../entity/Attendance";
import { Lecture } from "../entity/Lecture";
import { StudentCourse } from "../entity/StudentCourse";
import { Student } from "../entity/Student";
import { ValidationUtil } from "../util/ValidationUtil";

import * as crypto from "crypto";

export class AttendanceController {
    // store ongoing attenace markings
    static ongoingMarkings = {

    }

    static async startMarking(lectureId, socketId, attendanceNamespace) {

        // get the relevant client from connected clients
        const currentClient = attendanceNamespace.connected[socketId];

        // check if valid data is given
        await ValidationUtil.validate("ATTENDANCE", { lectureId }).catch(e => {
            attendanceNamespace.to(socketId).emit("error", "Please provide a valid lectrue.");
            currentClient.disconnect();
            throw e;
        });

        // search for a lecture with given id
        const lecture = await getRepository(Lecture).findOne({
            where: { id: lectureId }
        }).catch(e => {
            console.log(e.code, e);
            attendanceNamespace.to(socketId).emit("error", "Server error!. Please check logs.");
            currentClient.disconnect();
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // when lecture is not found        
        if (lecture == undefined) {
            attendanceNamespace.to(socketId).emit("error", "That lecture doesn't exist!.");
            currentClient.disconnect();
            return;
        }

        // check lecture status 
        if (lecture.lectureStatusId !== 2) {
            attendanceNamespace.to(socketId).emit("error", "This lecture is not active!.");
            currentClient.disconnect();
            return;
        }

        // add lecture to ongoing markings
        this.ongoingMarkings[lectureId] = {
            mins: 0,
            code: "",
            callback: () => {
                // check if 30 mins reached
                if (this.ongoingMarkings["mins"] == 29) {
                    if (!this.ongoingMarkings["interval"]) return;
                    clearInterval(this.ongoingMarkings["interval"]);
                    currentClient.disconnect();
                    delete this.ongoingMarkings[lectureId];
                    return;
                }

                // md5 hash used for qr codes
                this.ongoingMarkings[lectureId].code = crypto.createHash("md5").update(lectureId + new Date().toISOString()).digest("hex").substring(0, 8);

                // send code to relavant client
                attendanceNamespace.to(socketId).emit("code", JSON.stringify({
                    code: this.ongoingMarkings[lectureId].code,
                    lectureId: lectureId
                }));

                // increment mins
                this.ongoingMarkings["mins"] += 0.15;
            },
            socketId: socketId,
            attendanceNamespace: attendanceNamespace
        }

        // invoke callback for the first time
        this.ongoingMarkings[lectureId].callback();

        // setInterval for callback
        this.ongoingMarkings[lectureId]["interval"] = setInterval(this.ongoingMarkings[lectureId].callback, 15000);
    }

    // mark requests from the app
    static async markAttendance(session, data) {

        // get code and lectureId from data
        const code = data.code;
        const lectureId = data.lectureId;
        const studentId = data.studentId;
        const lecturerId = data.lecturerId;

        // check if valid data is given
        await ValidationUtil.validate("ATTENDANCE",
            {
                studentId,
                lectureId,
                lecturerId: data.lecturerId == undefined ? 0 : data.lecturerId
            });

        // if this not an ongoing marking
        if (!this.ongoingMarkings[lectureId]) {
            throw {
                status: false,
                type: "input",
                msg: "There is no ongoing session for this lecture!."
            };
        }

        // check of provided code is valid
        if (this.ongoingMarkings[lectureId].code !== code) {
            console.log("Invalid code");
            return;
        }

        // if this request is from a student
        if (process.env.PRODUCTION == "true") {
            if (lecturerId == undefined) {
                if (session.data.studentId !== studentId) {
                    throw {
                        status: false,
                        type: "perm",
                        msg: "You don't have permission to mark someone else!."
                    };
                }
            } else {
                if (lecturerId !== session.data.lecturerId) {
                    throw {
                        status: false,
                        type: "perm",
                        msg: "You don't have permission to perform this action!"
                    }
                }
            }
        }

        // check student is registered for the course
        const lecture = await getRepository(Lecture).findOne({
            where: { id: lectureId }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        const studentCourse = await getRepository(StudentCourse).findOne({
            where: { studentId: studentId, courseId: lecture.courseId }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // if student is not registered for the course
        if (studentCourse == undefined) {
            throw {
                status: false,
                type: "input",
                msg: "This student is not enrolled in the course!."
            };
        }

        // check if attendance is already marked
        const attendace = await getRepository(Attendance).findOne({
            where: { studentId: studentId, lectureId: lectureId }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        if (attendace !== undefined) {
            throw {
                status: false,
                type: "input",
                msg: "Your attendance is already marked!."
            };
        }

        // save attendance
        const entry = new Attendance();
        entry.studentId = studentId;
        entry.lectureId = lectureId;

        await getRepository(Attendance).save(entry).then(newEntry => {
            // update live attendace marking list
            this.sendUpdatesToClient(newEntry);
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "Attendance has been marked."
        }
    }

    static async sendUpdatesToClient(newEntry) {
        const lectureId = newEntry.lectureId;
        const studentId = newEntry.lectureId;

        // get student info
        const student = await getRepository(Student).findOne({
            where: { studentId: studentId }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        if (student == undefined) return;

        // send to relavant client
        const socketId = this.ongoingMarkings[lectureId].socketId;
        this.ongoingMarkings[lectureId].attendanceNamespace.to(socketId).emit("newMarking", JSON.stringify({
            student: student,
            markedDatetime: newEntry.markedDatetime
        }));
    }
}