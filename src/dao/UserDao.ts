import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id, u.email, u.regDatetime"
            ])
            .leftJoinAndSelect("role", "r")
            .leftJoinAndSelect("userType", "ut")
            .leftJoinAndSelect("student", "st")
            .leftJoinAndSelect("lecturer", "lec")
            .where("u.email LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }

    static getOne(id) {
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id, u.email, u.regDatetime"
            ])
            .leftJoinAndSelect("role", "r")
            .leftJoinAndSelect("userType", "ut")
            .leftJoinAndSelect("student", "st")
            .leftJoinAndSelect("lecturer", "lec")
            .where("u.id = :keyword", { id })
            .getOne()
            .catch(e => {
                console.log(e.code, e);
                throw {
                    status: false,
                    type: "server",
                    msg: "Server Error!. Please check logs."
                };
            });
    }
}