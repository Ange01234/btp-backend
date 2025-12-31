import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LineItemDto {
  @ApiProperty({
    example: 'Peinture murs et plafonds',
    description: 'Designation of the item',
  })
  @IsString()
  designation: string;

  @ApiProperty({ example: 120, description: 'Quantity' })
  @IsNumber()
  quantity: number;

  @ApiProperty({ example: 25, description: 'Unit price' })
  @IsNumber()
  unitPrice: number;
}

export class CreateDevisDto {
  @ApiProperty({
    example: '1',
    description: 'The chantier ID associated with this devis',
  })
  @IsString()
  chantierId: string;

  @ApiProperty({ example: '2025-01-10', description: 'Date of the devis' })
  @IsDateString()
  date: string;

  @ApiProperty({
    example: 'Brouillon',
    enum: ['Brouillon', 'Envoyé', 'Accepté', 'Refusé'],
  })
  @IsEnum(['Brouillon', 'Envoyé', 'Accepté', 'Refusé'])
  status: string;

  @ApiProperty({
    type: [LineItemDto],
    description: 'List of items in the devis',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LineItemDto)
  lineItems: LineItemDto[];

  @ApiPropertyOptional({ example: 0.18, description: 'TVA rate' })
  @IsOptional()
  @IsNumber()
  tvaRate?: number;
}
