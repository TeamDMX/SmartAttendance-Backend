import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lecture } from "./Lecture";

@Entity("lecture_status", { schema: "smart_attendance" })
export class LectureStatus {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(() => Lecture, (lecture) => lecture.lectureStatus)
  lectures: Lecture[];
}
