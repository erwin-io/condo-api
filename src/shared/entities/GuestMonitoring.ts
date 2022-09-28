import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { VisitType } from "./VisitType";
import { Tenant } from "./Tenant";
import { VisitStatus } from "./VisitStatus";

@Index("PK_GuestMonitoring", ["guestMonitoringId"], { unique: true })
@Entity("GuestMonitoring", { schema: "dbo" })
export class GuestMonitoring {
  @PrimaryGeneratedColumn({ type: "bigint", name: "GuestMonitoringId" })
  guestMonitoringId: string;

  @Column("nvarchar", { name: "NameOfGuest" })
  nameOfGuest: string;

  @Column("nvarchar", { name: "Address" })
  address: string;

  @Column("date", { name: "DateOfVisit" })
  dateOfVisit: Date;

  @ManyToOne(() => VisitType, (visitType) => visitType.guestMonitorings)
  @JoinColumn([{ name: "VisitTypeId", referencedColumnName: "visitTypeId" }])
  visitType: VisitType;

  @ManyToOne(() => Tenant, (tenant) => tenant.guestMonitorings)
  @JoinColumn([{ name: "TenantId", referencedColumnName: "tenantId" }])
  tenant: Tenant;

  @ManyToOne(() => VisitStatus, (visitStatus) => visitStatus.guestMonitorings)
  @JoinColumn([
    { name: "VisitStatusId", referencedColumnName: "visitStatusId" },
  ])
  visitStatus: VisitStatus;
}
