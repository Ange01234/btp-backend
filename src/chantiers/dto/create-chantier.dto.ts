import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateChantierDto {
  @ApiProperty({
    example: 'Rénovation Appartement Paris',
    description: 'The name of the chantier',
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'Jean Dupont',
    description: 'The name of the client',
  })
  @IsString()
  client: string;

  @ApiProperty({
    example: 'Paris XV',
    description: 'The location of the chantier',
  })
  @IsString()
  location: string;

  @ApiProperty({
    example: '2025-01-15',
    description: 'Start date of the chantier',
  })
  @IsDateString()
  startDate: string;

  @ApiPropertyOptional({
    example: '2025-06-30',
    description: 'End date of the chantier',
  })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @ApiProperty({ example: 45000000, description: 'Budget for the chantier' })
  @IsNumber()
  budget: number;

  @ApiProperty({
    example: 'En cours',
    enum: ['En cours', 'Terminé', 'Suspendu'],
  })
  @IsEnum(['En cours', 'Terminé', 'Suspendu'])
  status: string;

  @ApiPropertyOptional({
    description: 'Array of user IDs to add as spectators (read-only)',
    type: [String],
  })
  @IsOptional()
  @IsArray()
  spectatorIds?: string[];
}
