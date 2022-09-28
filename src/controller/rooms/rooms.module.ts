import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomsService } from "src/services/rooms.service";
import { RoomsController } from "./rooms.controller";
import { Rooms } from "src/shared/entities/Rooms";
@Module({
  imports: [TypeOrmModule.forFeature([Rooms])],
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
