require("dotenv").config();

import { getRepository } from "typeorm";
import { Course } from "../entity/Course";
import { CourseDao } from "../dao/CourseDao";
import { ValidationUtil } from "../util/ValidationUtil";

export class CourseController {

    static async getOne(courseId: number) {

        // check if valid data is given
        await ValidationUtil.validate("COURSE", { id: courseId });

        // search for an entry with given id
        const entry = await getRepository(Course).findOne({
            where: { id: courseId }
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

        const entries = await CourseDao.search(keyword, skip).catch(e => {
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

    static async update(courseId: number, data) {
        // create entry object
        const editedEntry = data as Course;
        editedEntry.id = courseId;

        // check if valid data is given
        await ValidationUtil.validate("COURSE", editedEntry);

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(Course).findOne(editedEntry.id).catch(e => {
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
                msg: "Entry with that id doesn't exist!"
            }
        }

        // update or create entry
        await getRepository(Course).save(editedEntry).catch(e => {
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

    static async save(data) {
        // create entry object
        const entry = data as Course;

        // check if valid data is given
        await ValidationUtil.validate("COURSE", entry);

        await getRepository(Course).save(entry).catch(e => {
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

    static async delete(courseId: number) {
        // check if valid data is given
        await ValidationUtil.validate("COURSE", { id: courseId });

        // find the entry with the given id
        const entry = await getRepository(Course).findOne({ id: courseId }).catch(e => {
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
        await getRepository(Course).delete(entry).catch(e => {
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