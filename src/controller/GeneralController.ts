import { getRepository } from "typeorm";

export class GeneralController {
    static async get(tableName: string) {

        const generalTables = ["user_type", "role", "course"];

        // check if table name is given
        if (!tableName) {
            throw {
                status: false,
                type: "input",
                msg: "Please provide a valid table name."
            };
        }

        if (!generalTables.includes(tableName)) {
            throw {
                status: false,
                type: "input",
                msg: "That table name is not listed under general tables."
            };
        }

        const entries = await getRepository(tableName).find()
            .catch(() => {
                throw {
                    status: false,
                    type: "input",
                    msg: "There is no table under that name!."
                };
            });

        return {
            status: true,
            data: entries
        }
    }
}