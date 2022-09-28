import { Module } from "@nestjs/common";
import { AppService } from "./app.service";
import { UsersModule } from "./controller/users/users.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigService } from "./shared/typeorm/typeorm.service";
import { getEnvPath } from "./common/helper/env.helper";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./controller/auth/auth.module";
import { RolesModule } from "./controller/roles/roles.module";
import { RoomsModule } from "./controller/rooms/rooms.module";
import { GuestMonitoringModule } from "./controller/guest-monitoring/guest-monitoring.module";
import { IncidentsReportsModule } from "./controller/incidents-reports/incidents-reports.module";
import { MonthlyDuesModule } from './controller/monthly-dues/monthly-dues.module';
const envFilePath: string = getEnvPath(`${__dirname}/common/envs`);
@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath, isGlobal: true }),
    TypeOrmModule.forRootAsync({ useClass: TypeOrmConfigService }),
    AuthModule,
    UsersModule,
    RolesModule,
    RoomsModule,
    GuestMonitoringModule,
    IncidentsReportsModule,
    MonthlyDuesModule,
  ],
  providers: [AppService],
  controllers: [],
})
export class AppModule {}
