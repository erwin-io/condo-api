import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsBooleanString, IsDate, IsNotEmpty } from "class-validator";

export class CreateMonthlyDuesDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  dueDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  generatedDate: Date;

  @ApiProperty()
  @IsNotEmpty()
  tenantId: string;
}