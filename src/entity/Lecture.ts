import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Attendance } from "./Attendance";
import { Course } from "./Course";
import { LectureHall } from "./LectureHall";

@Index("fk_lecture_lecture_hall1_idx", ["lectureHallId"], {})
@Entity("lecture", { schema: "smart_attendance" })
export class Lecture {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("date", { name: "date" })
  date: string;

  @Column("varchar", { name: "time", length: 45 })
  time: string;

  @Column("int", { name: "lecture_hall_id" })
  lectureHallId: number;

  @OneToMany(() => Attendance, (attendance) => attendance.lecture)
  attendances: Attendance[];

  @ManyToMany(() => Course, (course) => course.lectures)
  courses: Course[];

  @ManyToOne(() => LectureHall, (lectureHall) => lectureHall.lectures, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecture_hall_id", referencedColumnName: "id" }])
  lectureHall: LectureHall;
}
