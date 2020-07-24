require("dotenv").config();

import { User } from "../entity/User";
import { getRepository } from "typeorm";
import * as crypto from "crypto";
import { AuthController } from "./AuthController";

export class AppAuthController extends AuthController {

    static async registerStudent(session, data) {
        // find user with given details
        const user = await getRepository(User).findOne({
            where: { email: data.email },
            relations: ["student"]
        }).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        });

        // if user deosnt exist 
        if (!user || !user.student) {
            throw {
                status: false,
                type: "input",
                msg: "Your details are not found in the system. Please check your email address again."
            }
        }

        // check if student is already registered
        if (user.isActive == true) {
            throw {
                status: false,
                type: "input",
                msg: "You are already registred in the system!. Please contact system administrator if you want to reset your login."
            }
        }

        // check student details
        const student = user.student;

        if (student.indexNumber != data.indexNumber || student.regNumber != data.regNumber) {
            throw {
                status: false,
                type: "input",
                msg: "Your index number or registration number is invalid!."
            }
        }

        // hash the password
        const hashedPass = crypto.createHash("sha512").update(`${data.password}`).digest("hex");

        // set user password and save it
        user.password = hashedPass;
        user.isActive = true;

        await getRepository(User).save(user).catch(e => {
            console.log(e.code, e);
            throw {
                status: false,
                type: "server",
                msg: "Server Error!. Please check console logs."
            }
        });

        // log in
        return this.logIn(session, { email: user.email, password: data.password });
    }
}