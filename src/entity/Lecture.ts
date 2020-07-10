import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attendance } from "./Attendance";
import { Course } from "./Course";
import { LectureHall } from "./LectureHall";
import { LectureStatus } from "./LectureStatus";
import { Lecturer } from "./Lecturer";

@Index("fk_lecture_lecture_hall1_idx", ["lectureHallId"], {})
@Index("fk_lecture_course1_idx", ["courseId"], {})
@Index("fk_lecture_lecture_status1_idx", ["lectureStatusId"], {})
@Index("fk_lecture_lecturer1_idx", ["lecturerId"], {})
@Entity("lecture", { schema: "smart_attendance" })
export class Lecture {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", length: 45 })
  code: string;

  @Column("datetime", {
    name: "start_datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  startDatetime: Date;

  @Column("int", { name: "allowed_mins", default: () => "'30'" })
  allowedMins: number;

  @Column("int", { name: "lecture_hall_id" })
  lectureHallId: number;

  @Column("int", { name: "course_id" })
  courseId: number;

  @Column("int", { name: "lecture_status_id" })
  lectureStatusId: number;

  @Column("int", { name: "lecturer_id" })
  lecturerId: number;

  @OneToMany(() => Attendance, (attendance) => attendance.lecture)
  attendances: Attendance[];

  @ManyToOne(() => Course, (course) => course.lectures, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "course_id", referencedColumnName: "id" }])
  course: Course;

  @ManyToOne(() => LectureHall, (lectureHall) => lectureHall.lectures, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecture_hall_id", referencedColumnName: "id" }])
  lectureHall: LectureHall;

  @ManyToOne(() => LectureStatus, (lectureStatus) => lectureStatus.lectures, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecture_status_id", referencedColumnName: "id" }])
  lectureStatus: LectureStatus;

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.lectures, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecturer_id", referencedColumnName: "id" }])
  lecturer: Lecturer;
}
