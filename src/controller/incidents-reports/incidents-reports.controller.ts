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
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { UpdateGuestMonitoringDto } from "src/core/dto/guest-monitoring/guest-monitoring.update.dto";
import { UpdateIncidentReportStatusDto } from "src/core/dto/incidents-reports/incidents-reports-status.update.dto";
import { CreateIncidentReportDto } from "src/core/dto/incidents-reports/incidents-reports.create.dto";
import { UpdateIncidentReportDto } from "src/core/dto/incidents-reports/incidents-reports.update.dto";
import { CreateRoomDto } from "src/core/dto/rooms/room.create.dto";
import { UpdateRoomDto } from "src/core/dto/rooms/room.update.dto";
import { IncidentsReportsService } from "src/services/incidents-reports.service";
import { RoomsService } from "src/services/rooms.service";
import { IncidentsReports } from "src/shared/entities/IncidentsReports";

@ApiTags("incidents-reports")
@Controller("incidents-reports")
@ApiBearerAuth()
export class IncidentsReportsController {
  constructor(
    private readonly incidentsReportsService: IncidentsReportsService
  ) {}
  @Get()
  // @UseGuards(JwtAuthGuard)
  @ApiQuery({ name: "keyword", required: false })
  async findAll(keyword: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.incidentsReportsService.find(keyword);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":incidentsReportId")
  //   @UseGuards(JwtAuthGuard)
  async findOne(@Param("incidentsReportId") incidentsReportId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.incidentsReportsService.findById(incidentsReportId);
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
  async add(@Body() createIncidentsReport: CreateIncidentReportDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.incidentsReportsService.add(createIncidentsReport);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("")
  //   @UseGuards(JwtAuthGuard)
  async update(@Body() updateDto: UpdateIncidentReportDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.incidentsReportsService.update(updateDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("updateVisitStatus")
  //   @UseGuards(JwtAuthGuard)
  async updateStatus(@Body() body: UpdateIncidentReportStatusDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.incidentsReportsService.updateStatus(body);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
