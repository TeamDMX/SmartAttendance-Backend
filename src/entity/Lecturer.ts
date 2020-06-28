import {
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Course } from "./Course";
import { User } from "./User";

@Index("code_UNIQUE", ["code"], { unique: true })
@Entity("lecturer", { schema: "smart_attendance" })
export class Lecturer {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "code", nullable: true, unique: true, length: 10 })
  code: string | null;

  @Column("varchar", { name: "full_name", length: 100 })
  fullName: string;

  @ManyToMany(() => Course, (course) => course.lecturers)
  courses: Course[];

  @ManyToMany(() => User, (user) => user.lecturers)
  @JoinTable({
    name: "lecturer_user",
    joinColumns: [{ name: "lecturer_id", referencedColumnName: "id" }],
    inverseJoinColumns: [{ name: "user_id", referencedColumnName: "id" }],
    schema: "smart_attendance",
  })
  users: User[];
}
