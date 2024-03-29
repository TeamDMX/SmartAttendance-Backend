require("dotenv").config();

import { getRepository } from "typeorm";
import { Lecture } from "../entity/Lecture";
import { LectureDao } from "../dao/LectureDao";
import { ValidationUtil } from "../util/ValidationUtil";

export class LectureController {

    static async getOne(lectureId: number) {

        // check if valid data is given
        await ValidationUtil.validate("LECTURE", { id: lectureId });

        // search for an entry with given id
        const entry = await getRepository(Lecture).findOne({
            where: { id: lectureId }
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
        
        const entries = await LectureDao.search(keyword, skip).catch(e => {
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

    static async update(lectureId: number, data) {
        // create entry object
        const editedEntry = data as Lecture;
        editedEntry.id = lectureId;
        
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
                msg: "Entry with that id doesn't exist!"
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

    static async delete(lectureId: number) {
        // check if valid data is given
        await ValidationUtil.validate("LECTURE", { id: lectureId });

        // find the entry with the given id
        const entry = await getRepository(Lecture).findOne({ id: lectureId }).catch(e => {
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
}