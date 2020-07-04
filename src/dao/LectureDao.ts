import { getRepository } from "typeorm";
import { Lecture } from "../entity/Lecture";

export class LectureDao {
    static search({ keyword = "", skip = 0 }) {
        return getRepository(Lecture)
            .createQueryBuilder("r")
            .leftJoinAndSelect("r.course", "c")
            .leftJoinAndSelect("r.lectureHall", "lh")
            .leftJoinAndSelect("r.lectureStatus", "ls")
            .where("r.code LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("c.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("lh.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("lh.code LIKE :keyword", { keyword: `%${keyword}%` })
            .orWhere("ls.name LIKE :keyword", { keyword: `%${keyword}%` })
            .orderBy("r.startDatetime", "DESC")
            .skip(skip)
            .take(15)
            .getMany()
    }
}