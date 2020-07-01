import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecture } from "./Lecture";
import { Student } from "./Student";

@Index("fk_attendacne_student1_idx", ["studentId"], {})
@Index("fk_attendacne_lecture1_idx", ["lectureId"], {})
@Entity("attendance", { schema: "smart_attendance" })
export class Attendance {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "student_id" })
  studentId: number;

  @Column("int", { name: "lecture_id" })
  lectureId: number;

  @Column("datetime", {
    name: "marked_datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  markedDatetime: Date;

  @ManyToOne(() => Lecture, (lecture) => lecture.attendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecture_id", referencedColumnName: "id" }])
  lecture: Lecture;

  @ManyToOne(() => Student, (student) => student.attendances, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Student;
}
