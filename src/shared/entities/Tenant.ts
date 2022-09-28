import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { GuestMonitoring } from "./GuestMonitoring";
import { IncidentsReports } from "./IncidentsReports";
import { MonthlyDues } from "./MonthlyDues";
import { Users } from "./Users";
import { Gender } from "./Gender";
import { Rooms } from "./Rooms";

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

  @OneToMany(() => GuestMonitoring, (guestMonitoring) => guestMonitoring.tenant)
  guestMonitorings: GuestMonitoring[];

  @OneToMany(
    () => IncidentsReports,
    (incidentsReports) => incidentsReports.tenant
  )
  incidentsReports: IncidentsReports[];

  @OneToMany(() => MonthlyDues, (monthlyDues) => monthlyDues.tenant)
  monthlyDues: MonthlyDues[];

  @ManyToOne(() => Users, (users) => users.tenants)
  @JoinColumn([{ name: "UserId", referencedColumnName: "userId" }])
  user: Users;

  @ManyToOne(() => Gender, (gender) => gender.tenants)
  @JoinColumn([{ name: "GenderId", referencedColumnName: "genderId" }])
  gender: Gender;

  @ManyToOne(() => Rooms, (rooms) => rooms.tenants)
  @JoinColumn([{ name: "RoomId", referencedColumnName: "roomId" }])
  room: Rooms;
}
