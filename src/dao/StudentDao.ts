import { getRepository } from "typeorm";
import { Student } from "../entity/Student";

export class StudentDao {
    static search(keyword: String, skip: number) {
        return getRepository(Student)
            .createQueryBuilder("r")
            .where("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.indexNumber LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.regNumber LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}