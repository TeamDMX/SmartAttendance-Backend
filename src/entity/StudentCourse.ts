import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { Student } from "./Student";

@Index("fk_student_has_course_course1_idx", ["courseId"], {})
@Index("fk_student_has_course_student1_idx", ["studentId"], {})
@Entity("student_course", { schema: "smart_attendance" })
export class StudentCourse {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "student_id" })
  studentId: number;

  @Column("int", { name: "course_id" })
  courseId: number;

  @ManyToOne(() => Course, (course) => course.studentCourses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "id" }])
  course: Course;

  @ManyToOne(() => Student, (student) => student.studentCourses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Student;
}
