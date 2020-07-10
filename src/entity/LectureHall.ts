import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Lecture } from "./Lecture";

@Entity("lecture_hall", { schema: "smart_attendance" })
export class LectureHall {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", length: 60 })
  code: string;

  @Column("varchar", { name: "name", length: 100 })
  name: string;

  @OneToMany(() => Lecture, (lecture) => lecture.lectureHall)
  lectures: Lecture[];
}
