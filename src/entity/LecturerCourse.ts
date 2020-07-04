import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { Lecturer } from "./Lecturer";

@Index("fk_lecturer_has_course_course1_idx", ["courseId"], {})
@Index("fk_lecturer_has_course_lecturer1_idx", ["lecturerId"], {})
@Entity("lecturer_course", { schema: "smart_attendance" })
export class LecturerCourse {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("int", { name: "lecturer_id" })
  lecturerId: number;

  @Column("int", { name: "course_id" })
  courseId: number;

  @ManyToOne(() => Course, (course) => course.lecturerCourses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "id" }])
  course: Course;

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.lecturerCourses, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecturer_id", referencedColumnName: "id" }])
  lecturer: Lecturer;
}
