require("dotenv").config();

import { getRepository } from "typeorm";
import { LectureHall } from "../entity/LectureHall";
import { LecturerDao } from "../dao/LecturerDao";
import { LectureHallDao } from "../dao/LectureHallDao";
import { ValidationUtil } from "../util/ValidationUtil";

export class LectureHallController {

    static async getOne(lectureHallId: number) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURE_HALL", { id: lectureHallId });

        // search for an entry with given id
        const entry = await getRepository(LectureHall).findOne({
            where: { id: lectureHallId }
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

        const entries = await LectureHallDao.search(keyword, skip).catch(e => {
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
        // create entry object
        const entry = data as LectureHall;

        // check if valid data is given
        await ValidationUtil.validate("LECTURE_HALL", entry);

        await getRepository(LectureHall).save(entry).catch(e => {
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

    static async update(lectureHallId: number, data) {
        // create entry object
        const editedEntry = data as LectureHall;
        editedEntry.id = lectureHallId;

        // check if valid data is given
        await ValidationUtil.validate("LECTURE_HALL", editedEntry);

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(LectureHall).findOne(editedEntry.id).catch(e => {
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
        await getRepository(LectureHall).save(editedEntry).catch(e => {
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

    static async delete(lectureHallId: number) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURE_HALL", { lectureHallId });

        // find the entry with the given id
        const entry = await getRepository(LectureHall).findOne({ id: lectureHallId }).catch(e => {
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
        await getRepository(LectureHall).delete(entry).catch(e => {
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