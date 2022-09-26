import {
  Controller,
  Get,
  Param,
  Post,
  Body,
  Put,
  UseGuards,
  Query,
} from "@nestjs/common";
import { UsersService } from "../../services/users.service";
import {
  ToggleEnableDto,
  UpdateTenantUserDto,
  UpdateStaffUserDto,
} from "../../core/dto/users/user.update.dto";
import { CustomResponse } from "./../../common/helper/customresponse.helpers";
import {
  CreateTenantUserDto,
  CreateStaffUserDto,
} from "../../core/dto/users/user.create.dto";
import { ApiBearerAuth, ApiQuery, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../../core/auth/jwt.auth.guard";

@ApiTags("users")
@Controller("users")
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @ApiQuery({
    name: "userTypeId",
    description: "Gets the User type id",
    required: true,
    type: String,
  })
  @UseGuards(JwtAuthGuard)
  async findAll(@Query("userTypeId") userTypeId?) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findAll(userTypeId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getStaffByAdvanceSearch")
  @ApiQuery({ name: "isAdvance", required: false })
  @ApiQuery({ name: "keyword", required: false })
  @ApiQuery({ name: "userId", required: false })
  @ApiQuery({ name: "username", required: false })
  @ApiQuery({ name: "roles", required: false })
  @ApiQuery({ name: "email", required: false })
  @ApiQuery({ name: "mobileNumber", required: false })
  @ApiQuery({ name: "name", required: false })
  @UseGuards(JwtAuthGuard)
  async getStaffByAdvanceSearch(
    @Query("isAdvance") isAdvance: boolean,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("keyword") keyword: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("userId") userId: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("username") username: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("roles") roles: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("email") email: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("mobileNumber") mobileNumber: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("name") name: string = ""
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findStaffUserByFilter(
        isAdvance,
        keyword,
        userId,
        username,
        roles.trim() === "" ? [] : roles.split(","),
        email,
        mobileNumber,
        name
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get("getTenantByAdvanceSearch")
  @ApiQuery({ name: "isAdvance", required: false })
  @ApiQuery({ name: "keyword", required: false })
  @ApiQuery({ name: "userId", required: false })
  @ApiQuery({ name: "username", required: false })
  @ApiQuery({ name: "email", required: false })
  @ApiQuery({ name: "mobileNumber", required: false })
  @ApiQuery({ name: "name", required: false })
  @UseGuards(JwtAuthGuard)
  async getTenantByAdvanceSearch(
    @Query("isAdvance") isAdvance: boolean,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("keyword") keyword: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("userId") userId: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("username") username: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("email") email: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("mobileNumber") mobileNumber: string = "",
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    @Query("name") name: string = ""
  ) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findTenantUserByFilter(
        isAdvance,
        keyword,
        userId,
        username,
        email,
        mobileNumber,
        name
      );
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard)
  async findOne(@Param("id") userId: string) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.findById(userId);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/tenant")
  @UseGuards(JwtAuthGuard)
  async createTenant(@Body() createTenantUserDto: CreateTenantUserDto) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.createTenantUser(createTenantUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Post("/staff")
  @UseGuards(JwtAuthGuard)
  async createStaff(@Body() createStaffUserDto: CreateStaffUserDto) {
    const res: CustomResponse = {};
    try {
      res.data = await this.userService.createStaffUser(createStaffUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/tenant")
  @UseGuards(JwtAuthGuard)
  async updateTenantUser(@Body() tenantUserDto: UpdateTenantUserDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.userService.updateTenantUser(tenantUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/staff")
  @UseGuards(JwtAuthGuard)
  async updateStaffUser(@Body() staffUserDto: UpdateStaffUserDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.userService.updateStaffUser(staffUserDto);
      res.success = true;
      return res;
    } catch (e) {
      res.success = false;
      res.message = e.message !== undefined ? e.message : e;
      return res;
    }
  }

  @Put("/toggleEnable")
  @UseGuards(JwtAuthGuard)
  async toggleEnable(@Body() toggleEnableDto: ToggleEnableDto) {
    const res: CustomResponse = {};
    try {
      const res: CustomResponse = {};
      res.data = await this.userService.toggleEnable(
        toggleEnableDto.enable,
        Number(toggleEnableDto.userId)
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
