require("dotenv").config();

import { getRepository } from "typeorm";
import { Lecturer } from "../entity/Lecturer";
import { LecturerCourse } from "../entity/LecturerCourse";
import { LecturerDao } from "../dao/LecturerDao";
import { ValidationUtil } from "../util/ValidationUtil";

export class LecturerController {
    static async getOne(courseId: number) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURER", { courseId });

        // search for an entry with given id
        const entry = await getRepository(Lecturer).findOne({
            where: { id: courseId },
            relations: ["lecturerCourses"]
            
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // check if entry exists
        if (entry !== undefined) {
            return {
                status: true,
                data: entry
            };
        } else {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find an entry with that id."
            };
        }
    }

    static async getMany(keyword: string, skip: number) {

        if (keyword.trim() == "") {
            keyword = ""
        }

        const entries = await LecturerDao.search(keyword, skip).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        return {
            status: true,
            data: entries
        };
    }

    static async save(data) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURER", data);

        // create entry object
        const entry = data as Lecturer;

        try {
            await getRepository(Lecturer).save(entry);

            // parse course ids
            const courseIds = data.courseIds.split(",");

            // save course ids
            for (let courseId of courseIds) {
                await getRepository(LecturerCourse).save({ lecturerId: entry.id, courseId: courseId });
            }

        } catch (e) {

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
        }

        return {
            status: true,
            msg: "That entry has been added!"
        };
    }

    static async update(courseId: number, data) {
        data.id = courseId;

        // check if valid data is given
        await ValidationUtil.validate("LECTURER", data);

        // create entry object
        const editedEntry = data as Lecturer;

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(Lecturer).findOne(editedEntry.id).catch(e => {
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

        try {
            // update entry
            await getRepository(Lecturer).save(editedEntry);

            // parse course ids
            const courseIds = data.courseIds.split(",");

            // delete exisiting lecturer courses
            await getRepository(LecturerCourse).delete({ lecturerId: editedEntry.id });

            // update lecturer coruses
            for (let courseId of courseIds) {
                await getRepository(LecturerCourse).save({ lecturerId: editedEntry.id, courseId: courseId });
            }

        } catch (e) {
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }

        return {
            status: true,
            msg: "That entry has been updated!"
        };
    }

    static async delete(courseId: number) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURER", { courseId });

        // find the entry with the given id
        const entry = await getRepository(Lecturer).findOne({ id: courseId }).catch(e => {
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
        await getRepository(Lecturer).delete(entry).catch(e => {
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
}