import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecturer } from "./Lecturer";
import { Role } from "./Role";
import { Student } from "./Student";
import { UserType } from "./UserType";

@Index("fk_user_role_idx", ["roleId"], {})
@Index("fk_user_user_type1_idx", ["userTypeId"], {})
@Index("fk_user_student1_idx", ["studentId"], {})
@Index("fk_user_lecturer1_idx", ["lecturerId"], {})
@Entity("user", { schema: "smart_attendance" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", length: 60 })
  email: string;

  @Column("varchar", { name: "password", length: 550 })
  password: string;

  @Column("datetime", {
    name: "reg_datetime",
    default: () => "CURRENT_TIMESTAMP",
  })
  regDatetime: Date;

  @Column("int", { name: "role_id" })
  roleId: number;

  @Column("int", { name: "user_type_id" })
  userTypeId: number;

  @Column("int", { name: "student_id", default: () => "'0'" })
  studentId: number;

  @Column("int", { name: "lecturer_id", default: () => "'0'" })
  lecturerId: number;

  @ManyToOne(() => Lecturer, (lecturer) => lecturer.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "lecturer_id", referencedColumnName: "id" }])
  lecturer: Lecturer;

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;

  @ManyToOne(() => Student, (student) => student.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "student_id", referencedColumnName: "id" }])
  student: Student;

  @ManyToOne(() => UserType, (userType) => userType.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "user_type_id", referencedColumnName: "id" }])
  userType: UserType;
}
