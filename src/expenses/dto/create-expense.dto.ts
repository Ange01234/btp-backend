import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateExpenseDto {
  @ApiProperty({
    example: '1',
    description: 'The chantier ID associated with this expense',
  })
  @IsString()
  chantierId: string;

  @ApiProperty({
    example: 'matériaux',
    enum: ['matériaux', 'main-d’œuvre', 'transport', 'autre'],
  })
  @IsEnum(['matériaux', 'main-d’œuvre', 'transport', 'autre'])
  type: string;

  @ApiProperty({
    example: 'Ciment (50 sacs)',
    description: 'Description of the expense',
  })
  @IsString()
  description: string;

  @ApiProperty({ example: 250000, description: 'Amount of the expense' })
  @IsNumber()
  amount: number;

  @ApiProperty({
    example: 'Sococim',
    description: 'Provider of the goods or services',
  })
  @IsString()
  provider: string;

  @ApiProperty({ example: '2025-01-20', description: 'Date of the expense' })
  @IsDateString()
  date: string;

  @ApiPropertyOptional({
    example: 'https://storage.example.com/proof.jpg',
    description: 'URL to the proof of expense',
  })
  @IsOptional()
  @IsString()
  proofUrl?: string;
}
