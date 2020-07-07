import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecturer } from "./Lecturer";
import { Student } from "./Student";
import { UserRole } from "./UserRole";

@Index("email_UNIQUE", ["email"], { unique: true })
@Index("fk_user_student1_idx", ["studentId"], {})
@Index("fk_user_lecturer1_idx", ["lecturerId"], {})
@Entity("user", { schema: "smart_attendance" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", unique: true, length: 60 })
  email: string;

  @Column("varchar", { name: "password", length: 550 })
  password: string;

  @Column("datetime", {
    name: "reg_datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  regDatetime: Date;

  @Column("int", { name: "student_id", nullable: true })
  studentId: number | null;

  @Column("int", { name: "lecturer_id", nullable: true })
  lecturerId: number | null;

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecturer_id", referencedColumnName: "id" }])
  lecturer: Lecturer;

  @ManyToOne(() => Student, (student) => student.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Student;

  @OneToMany(() => UserRole, (userRole) => userRole.user)
  userRoles: UserRole[];
}
