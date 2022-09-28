import { Column, Entity, Index, OneToMany } from "typeorm";
import { Rooms } from "./Rooms";
import { Users } from "./Users";

@Index("PK_EntityStatus", ["entityStatusId"], { unique: true })
@Entity("EntityStatus", { schema: "dbo" })
export class EntityStatus {
  @Column("bigint", { primary: true, name: "EntityStatusId" })
  entityStatusId: string;

  @Column("nvarchar", { name: "Name", length: 100 })
  name: string;

  @OneToMany(() => Rooms, (rooms) => rooms.entityStatus)
  rooms: Rooms[];

  @OneToMany(() => Users, (users) => users.entityStatus)
  users: Users[];
}
