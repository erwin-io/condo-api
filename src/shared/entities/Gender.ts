import { Column, Entity, Index, OneToMany } from "typeorm";
import { Staff } from "./Staff";
import { Tenant } from "./Tenant";

@Index("PK_Gender", ["genderId"], { unique: true })
@Entity("Gender", { schema: "dbo" })
export class Gender {
  @Column("bigint", { primary: true, name: "GenderId" })
  genderId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Staff, (staff) => staff.gender)
  staff: Staff[];

  @OneToMany(() => Tenant, (tenant) => tenant.gender)
  tenants: Tenant[];
}
