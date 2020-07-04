import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attendance } from "./Attendance";
import { StudentCourse } from "./StudentCourse";
import { User } from "./User";

@Index("index_number_UNIQUE", ["indexNumber"], { unique: true })
@Index("reg_number_UNIQUE", ["regNumber"], { unique: true })
@Entity("student", { schema: "smart_attendance" })
export class Student {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("char", { name: "reg_number", unique: true, length: 7 })
  regNumber: string;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @Column("varchar", { name: "index_number", unique: true, length: 12 })
  indexNumber: string;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @OneToMany(() => StudentCourse, (studentCourse) => studentCourse.student)
  studentCourses: StudentCourse[];

  @OneToMany(() => User, (user) => user.student)
  users: User[];
}
