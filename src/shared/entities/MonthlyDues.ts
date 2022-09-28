import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Tenant } from "./Tenant";

@Index("PK_MonthlyDues", ["monthlyDueId"], { unique: true })
@Entity("MonthlyDues", { schema: "dbo" })
export class MonthlyDues {
  @PrimaryGeneratedColumn({ type: "bigint", name: "MonthlyDueId" })
  monthlyDueId: string;

  @Column("date", { name: "DueDate" })
  dueDate: Date;

  @Column("date", { name: "GeneratedDate" })
  generatedDate: Date;

  @Column("decimal", {
    name: "DueAmount",
    precision: 18,
    scale: 2,
    default: () => "(0)",
  })
  dueAmount: number;

  @Column("decimal", {
    name: "AmountPaid",
    precision: 18,
    scale: 2,
    default: () => "(0)",
  })
  amountPaid: number;

  @Column("bit", { name: "IsPaid", default: () => "(0)" })
  isPaid: boolean;

  @Column("bit", { name: "MarkAsRead", default: () => "(0)" })
  markAsRead: boolean;

  @ManyToOne(() => Tenant, (tenant) => tenant.monthlyDues)
  @JoinColumn([{ name: "TenantId", referencedColumnName: "tenantId" }])
  tenant: Tenant;
}
