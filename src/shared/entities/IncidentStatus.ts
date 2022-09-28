import { Column, Entity, Index, OneToMany } from "typeorm";
import { IncidentsReports } from "./IncidentsReports";

@Index("PK_IncidentStatus", ["incidentStatusId"], { unique: true })
@Entity("IncidentStatus", { schema: "dbo" })
export class IncidentStatus {
  @Column("bigint", { primary: true, name: "IncidentStatusId" })
  incidentStatusId: string;

  @Column("nvarchar", { name: "Name", nullable: true, length: 100 })
  name: string | null;

  @OneToMany(
    () => IncidentsReports,
    (incidentsReports) => incidentsReports.incidentStatus
  )
  incidentsReports: IncidentsReports[];
}
