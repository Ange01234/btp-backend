import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ActivateDto {
  @ApiProperty({
    example: '507f1f77bcf86cd799439011',
    description: 'The ID of the user to activate',
  })
  @IsMongoId()
  @IsNotEmpty()
  userId: string;
}
