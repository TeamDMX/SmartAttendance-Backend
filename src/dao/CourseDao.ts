import { getRepository } from "typeorm";
import { Course } from "../entity/Course";

export class CourseDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Course)
            .createQueryBuilder("r")
            .where("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.code LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}