import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty } from "class-validator";

export class CreateGuestMonitoringDto {

  @ApiProperty()
  @IsNotEmpty()
  nameOfGuest: string;

  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dateOfVisit: Date;

  @ApiProperty()
  @IsNotEmpty()
  visitTypeId: string;

  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
}