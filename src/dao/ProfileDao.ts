import { getRepository } from "typeorm";
import { User } from "../entity/User";

export class ProfileDao {
    static getOne(userId: number) {
        return getRepository(User)
            .createQueryBuilder("u")
            .select([
                "u.id", "u.email", "u.regDatetime"
            ])
            .whereInIds([userId])
            .leftJoinAndSelect("u.student", "stu")
            .leftJoinAndSelect("u.lecturer", "lec")
            .leftJoinAndSelect("u.userRoles", "ur")
            .leftJoinAndSelect("ur.role", "r")
            .leftJoinAndSelect("r.privileges", "p")
            .leftJoinAndSelect("p.module", "m")
            .getOne()
    }
}