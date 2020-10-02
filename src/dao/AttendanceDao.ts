import { getRepository } from "typeorm";
import { Attendance } from "../entity/Attendance";
import { Lecture } from "../entity/Lecture";

export class AttendanceDao {
    static async getAttendances(regNumber: string, courseId: number) {
        const lectures = await getRepository(Lecture).find({ courseId: courseId });
        const lectureIds = lectures.map(lecture => lecture.id);

        // return empty array when there are no lectures for the given course
        if (lectureIds.length == 0) {
            return [];
        }

        const attendances = await getRepository(Attendance)
            .createQueryBuilder("at")
            .leftJoin("at.student", "st")
            .leftJoin("at.lecture", "lec")
            .where("st.regNumber = :keyword", { keyword: regNumber })
            .andWhere("at.lectureId IN (:...lectureIds)", { lectureIds: lectureIds })
            .getManyAndCount();

        return attendances;
    }
}