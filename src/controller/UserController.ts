require("dotenv").config();

import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { Student } from "../entity/Student";
import { Lecturer } from "../entity/Lecturer";
import { UserRole } from "../entity/UserRole";
import { UserDao } from "../dao/UserDao";
import { ValidationUtil } from "../util/ValidationUtil";
import * as crypto from "crypto";

export class UserController {

    static async getOne(studentId: number) {
        // check if valid data is given
        await ValidationUtil.validate("USER", { studentId });

        // search for an entry with given id
        const entry = await UserDao.getOne(studentId)

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
        const entries = await UserDao.search(keyword, skip).catch(e => {
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
        await ValidationUtil.validate("USER", data);

        // check if both lecCode and Student Reg number are provided
        if (data.lecCode != "null" && data.stuRegNumber != "null") {
            throw {
                status: false,
                type: "input",
                msg: "Invalid user type info!."
            }
        }

        const entry = data as User;

        // find student / lecturer
        let lecturer = undefined, student = undefined;
        try {
            if (data.lecCode != "null") {
                lecturer = await getRepository(Lecturer).findOne({ where: { code: data.lecCode } });
                if (!lecturer) {
                    throw {
                        status: false,
                        type: "input",
                        msg: "Lecturer with that code doesn't exist."
                    }
                }
                entry.lecturerId = lecturer.id;

            } else if (data.stuRegNumber != "null") {
                student = await getRepository(Student).findOne({ where: { regNumber: data.stuRegNumber } });
                if (!student) {
                    throw {
                        status: false,
                        type: "input",
                        msg: "Student with that registration number doesn't exist."
                    }
                }

                entry.studentId = student.id;
            }

        } catch (e) {
            console.log(e);
            if (e.status == true) throw e;
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }

        // hash passwrod
        entry.password = crypto.createHash("sha512").update(entry.password).digest("hex");
        
        const newUser = await getRepository(User).save(entry).catch(e => {
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

        // set roles for new user
        const roleIds = data.roleIds.split(",");
        
        const userRoles = roleIds.map(rid => {
            return { userId: newUser.id, roleId: rid }
        });

        await getRepository(UserRole).save(userRoles).catch(e => {
            console.log(e.code, e);
            if (e.code == "ER_DUP_ENTRY") {
                throw {
                    status: false,
                    type: "input",
                    msg: "User roles already exists!."
                }
            }
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs. (Role adding)"
            }
        });

        return {
            status: true,
            msg: "That entry has been added!"
        };
    }

    static async update(userId: number, data) {
        // create entry object
        data.id = userId;

        // check if valid data is given
        await ValidationUtil.validate("USER", data);


        // check if both lecCode and Student Reg number are provided
        if (data.lecCode != "null" && data.stuRegNumber != "null") {
            throw {
                status: false,
                type: "input",
                msg: "Invalid user type info!."
            }
        }

        const editedEntry = data as User;

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(User).findOne(editedEntry.id).catch(e => {
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


        // find student / lecturer
        let lecturer = undefined, student = undefined;
        try {
            if (data.lecCode != null) {
                lecturer = await getRepository(Lecturer).findOne({ where: { code: data.lecCode } });
                if (!lecturer) {
                    throw {
                        status: false,
                        type: "input",
                        msg: "Lecturer with that code doesn't exist."
                    }
                }
                editedEntry.lecturerId = lecturer.id;

            } else if (data.stuRegNumber != null) {
                student = await getRepository(Student).findOne({ where: { regNumber: data.stuRegNumber } });
                if (!student) {
                    throw {
                        status: false,
                        type: "input",
                        msg: "Student with that registration number doesn't exist."
                    }
                }

                editedEntry.studentId = student.id;
            }

        } catch (e) {
            if (e.status) throw e;
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }

        // hash passwrod
        editedEntry.password = crypto.createHash("sha512").update(editedEntry.password).digest("hex");

        // update entry
        await getRepository(User).save(editedEntry).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        });

        // delete exisitng user roles
        await getRepository(UserRole).delete({ userId: editedEntry.id });

        // update roles
        const roleIds = data.roleIds.split(",");
        const userRoles = roleIds.map(rid => {
            return { userId: editedEntry.id, roleId: rid }
        });

        await getRepository(UserRole).save(userRoles).catch(e => {
            console.log(e.code, e);
            if (e.code == "ER_DUP_ENTRY") {
                throw {
                    status: false,
                    type: "input",
                    msg: "User roles already exists!."
                }
            }
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs. (Role adding)"
            }
        });

        return {
            status: true,
            msg: "That entry has been updated!"
        };
    }

    static async delete(userId: number) {
        // check if valid data is given
        await ValidationUtil.validate("USER", userId);

        // find the entry with the given id
        const entry = await getRepository(User).findOne({ id: userId }).catch(e => {
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
        await getRepository(User).delete(entry).catch(e => {
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