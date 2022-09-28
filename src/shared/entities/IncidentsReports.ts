import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tenant } from "./Tenant";
import { IncidentStatus } from "./IncidentStatus";

@Index("PK_IncidentsReports", ["incidentsReportId"], { unique: true })
@Entity("IncidentsReports", { schema: "dbo" })
export class IncidentsReports {
  @PrimaryGeneratedColumn({ type: "bigint", name: "IncidentsReportId" })
  incidentsReportId: string;

  @Column("date", { name: "Date" })
  date: Date;

  @Column("nvarchar", { name: "Title", length: 200 })
  title: string;

  @Column("nvarchar", { name: "Message" })
  message: string;

  @ManyToOne(() => Tenant, (tenant) => tenant.incidentsReports)
  @JoinColumn([{ name: "TenantId", referencedColumnName: "tenantId" }])
  tenant: Tenant;

  @ManyToOne(
    () => IncidentStatus,
    (incidentStatus) => incidentStatus.incidentsReports
  )
  @JoinColumn([
    { name: "IncidentStatusId", referencedColumnName: "incidentStatusId" },
  ])
  incidentStatus: IncidentStatus;
}
