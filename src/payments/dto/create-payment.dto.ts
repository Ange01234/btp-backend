import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsEnum, IsNumber, IsString } from 'class-validator';

export class CreatePaymentDto {
  @ApiProperty({
    example: '1',
    description: 'The chantier ID associated with this payment',
  })
  @IsString()
  chantierId: string;

  @ApiProperty({ example: 5000, description: 'Amount received' })
  @IsNumber()
  amount: number;

  @ApiProperty({ example: '2025-01-12', description: 'Date of payment' })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'Virement',
    enum: ['Virement', 'Chèque', 'Espèces', 'Mobile Money'],
  })
  @IsEnum(['Virement', 'Chèque', 'Espèces', 'Mobile Money'])
  method: string;
}
