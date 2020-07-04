require("dotenv").config();

import { getRepository } from "typeorm";
import { Attendance } from "../entity/Attendance";
import { Lecture } from "../entity/Lecture";
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
                    return;
                }

                // start sending qr codes
                attendanceNamespace.to(socketId).emit("code", JSON.stringify({
                    code: crypto.createHash("md5").update(lectureId + new Date().toISOString()).digest("hex"),
                    lectureId: lectureId
                }));

                // increment mins
                this.ongoingMarkings["mins"] += 0.15;
            }
        }

        // invoke callback for the first time
        this.ongoingMarkings[lectureId].callback();

        // setInterval for callback
        this.ongoingMarkings[lectureId]["interval"] = setInterval(this.ongoingMarkings[lectureId].callback, 15000);
    }
}