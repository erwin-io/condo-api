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
import { ApiTags, ApiBearerAuth } from "@nestjs/swagger";
import { CustomResponse } from "src/common/helper/customresponse.helpers";
import { JwtAuthGuard } from "src/core/auth/jwt.auth.guard";
import { CreateRoomDto } from "src/core/dto/rooms/room.create.dto";
import { UpdateRoomDto } from "src/core/dto/rooms/room.update.dto";
import { RoomsService } from "src/services/rooms.service";

@ApiTags("rooms")
@Controller("rooms")
@ApiBearerAuth()
export class RoomsController {
  constructor(private readonly roomService: RoomsService) {}
  @Get()
  // @UseGuards(JwtAuthGuard)
  async findAll() {
    const res: CustomResponse = {};
    try {
      res.data = await this.roomService.findAll();
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":roomId")
  //   @UseGuards(JwtAuthGuard)
  async findOne(@Param("roomId") roomId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.roomService.findById(roomId);
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
  async add(@Body() createServiceTypeDto: CreateRoomDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.roomService.add(createServiceTypeDto);
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
  async update(@Body() roleDto: UpdateRoomDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.roomService.update(roleDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Delete(":roomId")
  //   @UseGuards(JwtAuthGuard)
  async delete(@Param("roomId") roomId: string) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.roomService.delete(roomId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }
}
