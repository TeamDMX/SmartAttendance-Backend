require("dotenv").config();

import { getRepository } from "typeorm";
import { Student } from "../entity/Student";
import { StudentCourse } from "../entity/StudentCourse";
import { StudentDao } from "../dao/StudentDao";
import { ValidationUtil } from "../util/ValidationUtil";

export class StudentController {

    static async getOne(studentId: number) {
        // check if valid data is given
        await ValidationUtil.validate("STUDENT", { studentId });

        // search for an entry with given id
        const entry = await getRepository(Student).findOne({
            where: { id: studentId },
            relations: ["studentCourses"]
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
        const entries = await StudentDao.search(keyword, skip).catch(e => {
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
        await ValidationUtil.validate("STUDENT", data);

        // create entry object
        const entry = data as Student;

        try {
            await getRepository(Student).save(entry);

            // parse course ids
            const courseIds = data.courseIds.split(",");

            // save course ids
            for (let courseId of courseIds) {
                await getRepository(StudentCourse).save({ studentId: entry.id, courseId: courseId });
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

        await getRepository(Student).save(entry).catch(e => {
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

    static async update(studentId: number, data) {
        data.id = studentId;

        // check if valid data is given
        await ValidationUtil.validate("STUDENT", data);

        // create entry object
        const editedEntry = data as Student;

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(Student).findOne(editedEntry.id).catch(e => {
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
            await getRepository(Student).save(editedEntry);

            // parse course ids
            const courseIds = data.courseIds.split(",");

            // delete exisiting lecturer courses
            await getRepository(StudentCourse).delete({ studentId: editedEntry.id });

            // update student courses
            for (let courseId of courseIds) {
                await getRepository(StudentCourse).save({ studentId: editedEntry.id, courseId: courseId });
            }
        } catch (e) {
            console.log(e.code, e);
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

    static async delete(studentId: number) {
        // check if valid data is given
        await ValidationUtil.validate("STUDENT", { studentId });

        // find the entry with the given id
        const entry = await getRepository(Student).findOne({ id: studentId }).catch(e => {
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
        await getRepository(Student).delete(entry).catch(e => {
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

    static async getStudentCourses(regNumber: number) {
        await ValidationUtil.validate("STUDENT", { regNumber: regNumber });

        const studentCourses = await getRepository(StudentCourse).find({
            where: { student: { regNumber: regNumber } },
            relations: ["course"]
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
            data: studentCourses
        }
    }
}