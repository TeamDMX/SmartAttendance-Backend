import { getRepository } from "typeorm";
import { Lecture } from "../entity/Lecture";
import { LecturerCourse } from "../entity/LecturerCourse";
import { ValidationUtil } from "../util/ValidationUtil";

export class LecturerCourseController {
    static async getCourses({ lecturerId }) {
        await ValidationUtil.validate("LECTURER", { id: lecturerId });

        const entries = await getRepository(LecturerCourse).find({
            where: { lecturerId: lecturerId },
            relations: ["course"]
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        if (entries !== undefined || entries.length > 0) {
            return {
                status: true,
                data: entries
            };
        } else {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find any entries for this lecturer."
            };
        }
    }

    static async getLectures({ courseId }) {
        await ValidationUtil.validate("COURSE", { id: courseId });

        const entries = await getRepository(Lecture).find({
            where: { courseId: courseId },
            relations: ["lectureStatus"],
            order: {
                "startDatetime": "DESC"
            }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        if (entries !== undefined || entries.length > 0) {
            return {
                status: true,
                data: entries
            };
        } else {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find any entries for this lecturer."
            };
        }
    }

    static async saveLecture(data) {
        // create entry object
        const entry = data as Lecture;

        // check if valid data is given
        await ValidationUtil.validate("LECTURE", entry);

        await getRepository(Lecture).save(entry).catch(e => {
            console.log(e.code, e);

            if (e.code == "ER_DUP_ENTRY") {
                throw {
                    status: false,
                    type: "input",
                    msg: "Entry already exists!."
                }
            }
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That entry has been added!"
        };
    }

    static async updateLecture(data) {
        // create entry object
        const editedEntry = data as Lecture;

        // check if valid data is given
        await ValidationUtil.validate("LECTURE", editedEntry);

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(Lecture).findOne(editedEntry.id).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!selectedEntry) {
            throw {
                status: false,
                type: "input",
                msg: "That entry doesn't exist in our database!."
            }
        }

        // update entry
        await getRepository(Lecture).save(editedEntry).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That entry has been updated!"
        };
    }

    static async deleteLecture({ id }) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURE", { id });

        // find the entry with the given id
        const entry = await getRepository(Lecture).findOne({ id: id }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        if (!entry) {
            throw {
                status: false,
                type: "input",
                msg: "That entry doesn't exist in our database!."
            }
        }

        // delete the entry
        await getRepository(Lecture).delete(entry).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            msg: "That entry has been deleted!"
        };
    }

    // check if given lecture is allowed to mark attendance
    static async checkLectureMarkingEligibility({ id }) {

        // search for a lecture with given id
        const entry = await getRepository(Lecture).findOne({
            where: { id: id }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // check if entry exists
        if (entry == undefined) {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find a lecture with that id."
            };
        }

        // check lecture status 
        if (entry.lectureStatusId == 2) {
            throw {
                status: false,
                type: "input",
                msg: "Attendance marking for this lecture is already ongoing!."
            };
        }

        if (entry.lectureStatusId == 3) {
            throw {
                status: false,
                type: "input",
                msg: "Attendance marking for this lecture is already completed!."
            };
        }

        // check lecture is in the current timeslot
        const startDatetime = new Date(entry.startDatetime);
        const currentDatetime = new Date();

        if (startDatetime > currentDatetime) {
            throw {
                status: false,
                type: "input",
                msg: "This lecture has not started yet!."
            };
        }

        // update lecture status to active
        entry.lectureStatusId = 2;

        await getRepository(Lecture).save(entry).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        // send a response with lecture id back
        return {
            status: true,
            data: {
                id: entry.id
            },
            msg: "You can start attendance marking for this lecture."
        }
    }
}