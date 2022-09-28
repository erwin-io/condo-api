import { Column, Entity, Index, OneToMany } from "typeorm";
import { GuestMonitoring } from "./GuestMonitoring";

@Index("PK_VisitType", ["visitTypeId"], { unique: true })
@Entity("VisitType", { schema: "dbo" })
export class VisitType {
  @Column("bigint", { primary: true, name: "VisitTypeId" })
  visitTypeId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(
    () => GuestMonitoring,
    (guestMonitoring) => guestMonitoring.visitType
  )
  guestMonitorings: GuestMonitoring[];
}
