import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IncidentsReportsController } from "./incidents-reports.controller";
import { IncidentsReportsService } from "src/services/incidents-reports.service";
import { IncidentsReports } from "src/shared/entities/IncidentsReports";
@Module({
  imports: [TypeOrmModule.forFeature([IncidentsReports])],
  controllers: [IncidentsReportsController],
  providers: [IncidentsReportsService],
  exports: [IncidentsReportsService],
})
export class IncidentsReportsModule {}
