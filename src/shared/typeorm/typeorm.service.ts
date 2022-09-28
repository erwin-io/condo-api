import { EntityStatus } from "../entities/EntityStatus";
import { UserType } from "../entities/UserType";
import { Gender } from "../entities/Gender";
import { Staff } from "../entities/Staff";
import { Tenant } from "../entities/Tenant";
import { Users } from "../entities/Users";
import { Injectable, Inject } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmOptionsFactory, TypeOrmModuleOptions } from "@nestjs/typeorm";
import { GuestMonitoring } from "../entities/GuestMonitoring";
import { IncidentsReports } from "../entities/IncidentsReports";
import { IncidentStatus } from "../entities/IncidentStatus";
import { MonthlyDues } from "../entities/MonthlyDues";
import { Roles } from "../entities/Roles";
import { Rooms } from "../entities/Rooms";
import { VisitStatus } from "../entities/VisitStatus";
import { VisitType } from "../entities/VisitType";

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  @Inject(ConfigService)
  private readonly config: ConfigService;

  public createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: "mssql",
      host: this.config.get<string>("DATABASE_HOST"),
      // port: Number(this.config.get<number>("DATABASE_PORT")),
      database: this.config.get<string>("DATABASE_NAME"),
      username: this.config.get<string>("DATABASE_USER"),
      password: this.config.get<string>("DATABASE_PASSWORD"),
      entities: [
        Users,
        Roles,
        Tenant,
        Staff,
        Gender,
        UserType,
        EntityStatus,
        Rooms,
        MonthlyDues,
        IncidentsReports,
        IncidentStatus,
        GuestMonitoring,
        VisitStatus,
        VisitType,
      ],
      synchronize: false, // never use TRUE in production!
      options: { encrypt: false },
    };
  }
}
