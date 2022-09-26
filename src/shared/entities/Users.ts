import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Staff } from "./Staff";
import { Tenant } from "./Tenant";
import { UserType } from "./UserType";
import { Roles } from "./Roles";
import { EntityStatus } from "./EntityStatus";

@Index("PK_Users", ["userId"], { unique: true })
@Entity("Users", { schema: "dbo" })
export class Users {
  @PrimaryGeneratedColumn({ type: "bigint", name: "UserId" })
  userId: string;

  @Column("nvarchar", { name: "Username", length: 250 })
  username: string;

  @Column("nvarchar", { name: "Password", length: 250 })
  password: string;

  @Column("nvarchar", { name: "currentHashedRefreshToken", nullable: true })
  currentHashedRefreshToken: string | null;

  @Column("bit", { name: "IsAdminApproved", default: () => "(0)" })
  isAdminApproved: boolean;

  @Column("bit", { name: "Enable", default: () => "(1)" })
  enable: boolean;

  @OneToMany(() => Staff, (staff) => staff.user)
  staff: Staff[];

  @OneToMany(() => Tenant, (tenant) => tenant.user)
  tenants: Tenant[];

  @ManyToOne(() => UserType, (userType) => userType.users)
  @JoinColumn([{ name: "UserTypeId", referencedColumnName: "userTypeId" }])
  userType: UserType;

  @ManyToOne(() => Roles, (roles) => roles.users)
  @JoinColumn([{ name: "RoleId", referencedColumnName: "roleId" }])
  role: Roles;

  @ManyToOne(() => EntityStatus, (entityStatus) => entityStatus.users)
  @JoinColumn([
    { name: "EntityStatusId", referencedColumnName: "entityStatusId" },
  ])
  entityStatus: EntityStatus;
}
