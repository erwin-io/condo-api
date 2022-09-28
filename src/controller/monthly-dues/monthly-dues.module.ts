import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { MonthlyDuesService } from "src/services/monthly-dues.service";
import { MonthlyDuesController } from "./monthly-dues.controller";
import { MonthlyDues } from "src/shared/entities/MonthlyDues";
@Module({
  imports: [TypeOrmModule.forFeature([MonthlyDues])],
  controllers: [MonthlyDuesController],
  providers: [MonthlyDuesService],
  exports: [MonthlyDuesService],
})
export class MonthlyDuesModule {}
