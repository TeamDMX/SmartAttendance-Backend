import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecture } from "./Lecture";
import { LecturerCourse } from "./LecturerCourse";
import { User } from "./User";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("lecturer", { schema: "smart_attendance" })
export class Lecturer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "code", unique: true, length: 5 })
  code: string;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @OneToMany(() => Lecture, (lecture) => lecture.lecturer)
  lectures: Lecture[];

  @OneToMany(() => LecturerCourse, (lecturerCourse) => lecturerCourse.lecturer)
  lecturerCourses: LecturerCourse[];

  @OneToMany(() => User, (user) => user.lecturer)
  users: User[];
}
