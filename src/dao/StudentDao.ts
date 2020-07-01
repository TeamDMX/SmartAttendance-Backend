import { getRepository } from "typeorm";
import { Student } from "../entity/Student";

export class StudentDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Student)
            .createQueryBuilder("r")
            .where("r.fullName LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.indexNumber LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.regNumber LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}