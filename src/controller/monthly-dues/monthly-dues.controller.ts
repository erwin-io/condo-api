import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { UpdateIncidentReportStatusDto } from "src/core/dto/incidents-reports/incidents-reports-status.update.dto";
import { CreateIncidentReportDto } from "src/core/dto/incidents-reports/incidents-reports.create.dto";
import { UpdateIncidentReportDto } from "src/core/dto/incidents-reports/incidents-reports.update.dto";
import { CreateMonthlyDuesDto } from "src/core/dto/monthly-dues/monthly-dues.create.dto";
import { UpdateMonthlyDuePaymentDto } from "src/core/dto/monthly-dues/monthly-dues.update.dto";
import { IncidentsReportsService } from "src/services/incidents-reports.service";
import { MonthlyDuesService } from "src/services/monthly-dues.service";

@ApiTags("monthly-dues")
@Controller("monthly-dues")
@ApiBearerAuth()
export class MonthlyDuesController {
  constructor(private readonly monthlyDuesService: MonthlyDuesService) {}
  @Get()
  // @UseGuards(JwtAuthGuard) 
  @ApiQuery({ name: "tenantId", required: true })
  @ApiQuery({ name: "year", required: true })
  async findAll(@Query("tenantId") tenantId, @Query("year") year) {
    const res: CustomResponse = {};
    try {
      res.data = await this.monthlyDuesService.find(
        tenantId ? tenantId : "",
        year ? year : new Date().getFullYear()
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":monthlyDueId")
  //   @UseGuards(JwtAuthGuard)
  async findOne(@Param("monthlyDueId") monthlyDueId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.monthlyDuesService.findById(monthlyDueId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("")
  //   @UseGuards(JwtAuthGuard)
  async add(@Body() createDto: CreateMonthlyDuesDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.monthlyDuesService.add(createDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updatePayment")
  //   @UseGuards(JwtAuthGuard)
  async updatePayment(@Body() body: UpdateMonthlyDuePaymentDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.monthlyDuesService.updatePayment(body);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
