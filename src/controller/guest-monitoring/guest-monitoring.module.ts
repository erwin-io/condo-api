import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GuestMonitoringService } from "src/services/guest-monitoring.service";
import { GuestMonitoring } from "src/shared/entities/GuestMonitoring";
import { GuestMonitoringController } from "./guest-monitoring.controller";
@Module({
  imports: [TypeOrmModule.forFeature([GuestMonitoring])],
  controllers: [GuestMonitoringController],
  providers: [GuestMonitoringService],
  exports: [GuestMonitoringService],
})
export class GuestMonitoringModule {}
