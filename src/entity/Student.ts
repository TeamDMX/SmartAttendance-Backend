import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attendance } from "./Attendance";
import { Course } from "./Course";
import { User } from "./User";

@Index("index_number_UNIQUE", ["indexNumber"], { unique: true })
@Index("reg_number_UNIQUE", ["regNumber"], { unique: true })
@Entity("student", { schema: "smart_attendance" })
export class Student {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "reg_number", unique: true, length: 12 })
  regNumber: string;

  @Column("varchar", { name: "full_name", length: 100 })
  fullName: string;

  @Column("varchar", { name: "index_number", unique: true, length: 12 })
  indexNumber: string;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @ManyToMany(() => Course, (course) => course.students)
  courses: Course[];

  @OneToMany(() => User, (user) => user.student)
  users: User[];
}
