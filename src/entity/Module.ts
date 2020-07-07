import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Privilege } from "./Privilege";

@Entity("module", { schema: "smart_attendance" })
export class Module {
  @PrimaryGeneratedColumn({ type: "int", name: "id" })
  id: number;

  @Column("varchar", { name: "name", nullable: true, length: 45 })
  name: string | null;

  @OneToMany(() => Privilege, (privilege) => privilege.module)
  privileges: Privilege[];
}
