require("dotenv").config();

import { getRepository } from "typeorm";
import { User } from "../entity/User";
import { UserRole } from "../entity/UserRole";
import { UserDao } from "../dao/UserDao";
import { ValidationUtil } from "../util/ValidationUtil";
import * as crypto from "crypto";

export class UserController {
    static async get(data) {
        if (data !== undefined && data.id) {
            return this.getOne(data);
        } else {
            return this.search(data);
        }
    }

    private static async getOne({ id }) {
        // check if valid data is given
        await ValidationUtil.validate("USER", { id });

        // search for an entry with given id
        const entry = await UserDao.getOne(id)

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

    private static async search(data = {}) {
        const entries = await UserDao.search(data).catch(e => {
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
        const entry = data as User;

        // check if valid data is given
        await ValidationUtil.validate("USER", entry);

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
		const userRoles = data.roleIds.map(rid => {
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

    static async update(data) {
        // create entry object
        const editedEntry = data as User;

        // check if valid data is given
        await ValidationUtil.validate("USER", editedEntry);

        // check if an entry is present with the given id
        const selectedEntry = await getRepository(UserDao).findOne(editedEntry.id).catch(e => {
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
        await getRepository(UserDao).save(editedEntry).catch(e => {
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

    static async delete({ id }) {
        // check if valid data is given
        await ValidationUtil.validate("USER", { id });

        // find the entry with the given id
        const entry = await getRepository(User).findOne({ id: id }).catch(e => {
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