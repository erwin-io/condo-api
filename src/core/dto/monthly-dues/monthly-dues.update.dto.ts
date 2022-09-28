import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";

export class UpdateMonthlyDuePaymentDto {
  @ApiProperty()
  @IsNotEmpty()
  monthlyDueId: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  paymentAmount: number;
}
