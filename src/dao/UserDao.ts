import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class UserDao {
    static search(keyword: String, skip: number) {        
        
        if (keyword.trim() == "") {
            keyword = ""
        }
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id", "u.email", "u.regDatetime"
            ])
            .leftJoinAndSelect("u.userRoles", "ur")
            .leftJoinAndSelect("ur.role", "r")
            .leftJoinAndSelect("u.student", "st")
            .leftJoinAndSelect("u.lecturer", "lec")
            .where("u.email LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }

    static getOne(id: number) {
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id", "u.email", "u.regDatetime"
            ])
            .leftJoinAndSelect("u.userRoles", "ur")
            .leftJoinAndSelect("ur.role", "r")
            .leftJoinAndSelect("u.student", "st")
            .leftJoinAndSelect("u.lecturer", "lec")
            .where("u.id = :keyword", { keyword: id })
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