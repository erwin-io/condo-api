import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { EntityStatus } from "./EntityStatus";
import { Tenant } from "./Tenant";

@Index("PK_Rooms", ["roomId"], { unique: true })
@Index("U_Rooms", ["name", "entityStatusId"], { unique: true })
@Entity("Rooms", { schema: "dbo" })
export class Rooms {
  @PrimaryGeneratedColumn({ type: "bigint", name: "RoomId" })
  roomId: string;

  @Column("nvarchar", { name: "Name", unique: true, length: 100 })
  name: string;

  @Column("decimal", {
    name: "MonthlyRate",
    precision: 18,
    scale: 2,
    default: () => "(0)",
  })
  monthlyRate: number;

  @Column("bigint", {
    name: "EntityStatusId",
    unique: true,
    default: () => "(1)",
  })
  entityStatusId: string;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.rooms)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;

  @OneToMany(() => Tenant, (tenant) => tenant.room)
  tenants: Tenant[];
}
