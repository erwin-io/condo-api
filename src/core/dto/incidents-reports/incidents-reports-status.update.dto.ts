import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class UpdateIncidentReportStatusDto {
  @ApiProperty()
  @IsNotEmpty()
  incidentsReportId: string;
  
  @ApiProperty()
  @IsNotEmpty()
  incidentStatusId: string;
}