import { getRepository } from "typeorm";
import { Role } from "../entity/Role";
import { Privilege } from "../entity/Privilege";

export class PrivilegeController {

    static async getOne(roleId: number) {
        const role = await getRepository(Role).findOne({
            relations: ["privileges", "privileges.module"],
            where: { id: roleId }
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            };
        });

        // check if entry exists
        if (role !== undefined) {
            return {
                status: true,
                data: role
            };
        } else {
            throw {
                status: false,
                type: "input",
                msg: "Unable to find an user with that id."
            };
        }
    }

    static async update(roleId: number, data) {
        try {

            // delete exisiting privileges to avoid conflict
            await getRepository(Privilege).delete({ roleId: roleId });

            // insert privileges
            for (let p of data.privileges) {
                let privilege = new Privilege();
                privilege.moduleId = p.moduleId;
                privilege.roleId = p.roleId;
                privilege.permission = p.permission;
                await getRepository(Privilege).save(privilege);
            }

            return {
                status: true,
                msg: "Privileges has been updated!"
            };
        } catch (e) {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check logs."
            }
        }
    }
}