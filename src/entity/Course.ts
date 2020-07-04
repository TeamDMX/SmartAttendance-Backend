import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecture } from "./Lecture";
import { Lecturer } from "./Lecturer";
import { Student } from "./Student";

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

  @ManyToMany(() => Lecturer, (lecturer) => lecturer.courses)
  @JoinTable({
    name: "lecturer_course",
    joinColumns: [{ name: "course_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "lecturer_id", referencedColumnName: "id" }],
    schema: "smart_attendance",
  })
  lecturers: Lecturer[];

  @ManyToMany(() => Student, (student) => student.courses)
  @JoinTable({
    name: "student_course",
    joinColumns: [{ name: "course_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "student_id", referencedColumnName: "id" }],
    schema: "smart_attendance",
  })
  students: Student[];
}
