import {
  Column,
  Entity,
  Index,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("lecturer", { schema: "smart_attendance" })
export class Lecturer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", unique: true, length: 10 })
  code: string;

  @Column("varchar", { name: "full_name", length: 100 })
  fullName: string;

  @ManyToMany(() => Course, (course) => course.lecturers)
  courses: Course[];

  @OneToMany(() => User, (user) => user.lecturer)
  users: User[];
}
