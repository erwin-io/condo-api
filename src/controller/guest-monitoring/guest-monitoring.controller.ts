import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiBearerAuth, ApiQuery } from "@nestjs/swagger";
import { UpdateGuestMonitoringStatusDto } from "src/core/dto/guest-monitoring/guest-monitoring-status.update.dto";
import { CreateGuestMonitoringDto } from "src/core/dto/guest-monitoring/guest-monitoring.create.dto";
import { UpdateGuestMonitoringDto } from "src/core/dto/guest-monitoring/guest-monitoring.update.dto";
import { GuestMonitoringService } from "src/services/guest-monitoring.service";
import { CustomResponse } from "../../common/helper/customresponse.helpers";
import { JwtAuthGuard } from "../../core/auth/jwt.auth.guard";

@ApiTags("guest-monitoring")
@Controller("guest-monitoring")
@ApiBearerAuth()
export class GuestMonitoringController {
  constructor(
    private readonly guestMonitoringService: GuestMonitoringService
  ) {}

  @Get()
  @ApiQuery({ name: "keyword", required: false })
  //   @UseGuards(JwtAuthGuard)
  async findAll(keyword: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.guestMonitoringService.find(keyword);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":guestMonitoringId")
  //   @UseGuards(JwtAuthGuard)
  async findOne(@Param("guestMonitoringId") guestMonitoringId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.guestMonitoringService.findById(guestMonitoringId);
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
  async add(@Body() createGuestMonitoringDto: CreateGuestMonitoringDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.guestMonitoringService.add(
        createGuestMonitoringDto
      );
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
  async update(@Body() updateGuestMonitoringDto: UpdateGuestMonitoringDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.guestMonitoringService.update(
        updateGuestMonitoringDto
      );
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
  async updateVisitStatus(
    @Body() updateGuestMonitoringStatusDto: UpdateGuestMonitoringStatusDto
  ) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.guestMonitoringService.updateVisitStatus(
        updateGuestMonitoringStatusDto
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
