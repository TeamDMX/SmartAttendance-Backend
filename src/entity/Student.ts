import {
  Column,
  Entity,
  Index,
  JoinTable,
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

  @Column("varchar", {
    name: "reg_number",
    nullable: true,
    unique: true,
    length: 12,
  })
  regNumber: string | null;

  @Column("varchar", { name: "full_name", length: 100 })
  fullName: string;

  @Column("varchar", {
    name: "index_number",
    nullable: true,
    unique: true,
    length: 12,
  })
  indexNumber: string | null;

  @OneToMany(() => Attendance, (attendance) => attendance.student)
  attendances: Attendance[];

  @ManyToMany(() => Course, (course) => course.students)
  courses: Course[];

  @ManyToMany(() => User, (user) => user.students)
  @JoinTable({
    name: "student_user",
    joinColumns: [{ name: "student_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    schema: "smart_attendance",
  })
  users: User[];
}
