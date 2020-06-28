import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Lecturer } from "./Lecturer";
import { Student } from "./Student";
import { Role } from "./Role";

@Index("fk_user_role_idx", ["roleId"], {})
@Entity("user", { schema: "smart_attendance" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "email", length: 60 })
  email: string;

  @Column("varchar", { name: "password", nullable: true, length: 550 })
  password: string | null;

  @Column("datetime", {
    name: "reg_datetime",
    nullable: true,
    default: () => "CURRENT_TIMESTAMP",
  })
  regDatetime: Date | null;

  @Column("int", { name: "role_id" })
  roleId: number;

  @ManyToMany(() => Lecturer, (lecturer) => lecturer.users)
  lecturers: Lecturer[];

  @ManyToMany(() => Student, (student) => student.users)
  students: Student[];

  @ManyToOne(() => Role, (role) => role.users, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn([{ name: "role_id", referencedColumnName: "id" }])
  role: Role;
}
