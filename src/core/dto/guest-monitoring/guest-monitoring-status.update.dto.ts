import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateGuestMonitoringStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  guestMonitoringId: string;
  
  @ApiProperty()
  @IsNotEmpty()
  visitStatusId: string;
}