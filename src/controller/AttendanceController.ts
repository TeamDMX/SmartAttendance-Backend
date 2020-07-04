require("dotenv").config();

import { getRepository } from "typeorm";
import { Attendance } from "../entity/Attendance";
import { Lecture } from "../entity/Lecture";
import { StudentCourse } from "../entity/StudentCourse";

import * as crypto from "crypto";

export class AttendanceController {
    // store ongoing attenace markings
    static ongoingMarkings = {

    }

    static async startMarking(lectureId, socketId, attendanceNamespace) {

        // search for a lecture with given id
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


        // check lecture status 
        if (lecture.lectureStatusId !== 2) {
            attendanceNamespace.to(socketId).emit("error", "This lecture is not active!.");
            attendanceNamespace.connected[socketId].disconnect();
            return;
        }

        // add lecture to ongoing markings
        this.ongoingMarkings[lectureId] = {
            mins: 0,
            callback: () => {
                // check if 30 mins reached
                if (this.ongoingMarkings["mins"] == 29) {
                    if (!this.ongoingMarkings["interval"]) return;
                    clearInterval(this.ongoingMarkings["interval"]);
                    attendanceNamespace.connected[socketId].disconnect();
                    delete this.ongoingMarkings[lectureId];
                    return;
                }

                // start sending qr codes
                attendanceNamespace.to(socketId).emit("code", JSON.stringify({
                    code: crypto.createHash("md5").update(lectureId + new Date().toISOString()).digest("hex"),
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
        let studentId;

        // check of provided code is valid
        if (this.ongoingMarkings[lectureId].code !== code) {
            return;
        }

        // check if mark request is from the lecturer or student
        if (session.data.role.id == 3) {
            studentId = session.data.userId;
        } else if (session.data.role.id == 2) {
            studentId = data.id;
        } else {
            throw {
                status: false,
                type: "input",
                msg: "You aren't allowed to mark attendance"
            };
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

        // save attendance
        const entry = new Attendance();
        entry.studentId = studentId;
        entry.lectureId = lectureId;

        await getRepository(Attendance).save(entry).catch(e => {
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
}