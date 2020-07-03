import { getRepository } from "typeorm";
import { LectureHall } from "../entity/LectureHall";

export class LectureHallDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(LectureHall)
            .createQueryBuilder("r")
            .where("r.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("r.code LIKE :keyword", { keyword: `%${keyword}%` })
            .skip(skip)
            .take(15)
            .getMany()
    }
}