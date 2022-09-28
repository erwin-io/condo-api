import { Column, Entity, Index, OneToMany } from "typeorm";
import { GuestMonitoring } from "./GuestMonitoring";

@Index("PK_VisitStatus", ["visitStatusId"], { unique: true })
@Entity("VisitStatus", { schema: "dbo" })
export class VisitStatus {
  @Column("bigint", { primary: true, name: "VisitStatusId" })
  visitStatusId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(
    () => GuestMonitoring,
    (guestMonitoring) => guestMonitoring.visitStatus
  )
  guestMonitorings: GuestMonitoring[];
}
