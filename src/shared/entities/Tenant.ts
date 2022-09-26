import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Users } from "./Users";
import { Gender } from "./Gender";

@Index("PK_Tenant", ["tenantId"], { unique: true })
@Entity("Tenant", { schema: "dbo" })
export class Tenant {
  @PrimaryGeneratedColumn({ type: "bigint", name: "TenantId" })
  tenantId: string;

  @Column("nvarchar", { name: "FirstName", length: 250 })
  firstName: string;

  @Column("nvarchar", { name: "MiddleName", nullable: true, length: 250 })
  middleName: string | null;

  @Column("nvarchar", { name: "LastName", length: 250 })
  lastName: string;

  @Column("nvarchar", { name: "Email", length: 250 })
  email: string;

  @Column("nvarchar", { name: "MobileNumber", length: 250 })
  mobileNumber: string;

  @Column("nvarchar", { name: "Address" })
  address: string;

  @Column("date", { name: "BirthDate" })
  birthDate: Date;

  @Column("bigint", { name: "Age" })
  age: string;

  @ManyToOne(() => Users, (users) => users.tenants)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Gender, (gender) => gender.tenants)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;
}
