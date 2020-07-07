import { Column, Entity, OneToMany } from "typeorm";
import { Privilege } from "./Privilege";
import { UserRole } from "./UserRole";

@Entity("role", { schema: "smart_attendance" })
export class Role {
  @Column("int", { primary: true, name: "id" })
  id: number;

  @Column("varchar", { name: "name", length: 45 })
  name: string;

  @OneToMany(() => Privilege, (privilege) => privilege.role)
  privileges: Privilege[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}
