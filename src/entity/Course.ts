import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecture } from "./Lecture";
import { LecturerCourse } from "./LecturerCourse";
import { StudentCourse } from "./StudentCourse";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("course", { schema: "smart_attendance" })
export class Course {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", unique: true, length: 45 })
  code: string;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @OneToMany(() => Lecture, (lecture) => lecture.course)
  lectures: Lecture[];

  @OneToMany(() => LecturerCourse, (lecturerCourse) => lecturerCourse.course)
  lecturerCourses: LecturerCourse[];

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.course)
  studentCourses: StudentCourse[];
}
