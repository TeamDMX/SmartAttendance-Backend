import { getRepository } from "typeorm";
import { Lecturer } from "../entity/Lecturer";

export class LecturerDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Lecturer)
            .createQueryBuilder("r")
            .where("r.fullName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.code LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}