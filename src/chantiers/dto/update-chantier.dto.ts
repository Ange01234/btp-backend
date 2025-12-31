import { PartialType } from '@nestjs/swagger';
import { CreateChantierDto } from './create-chantier.dto';

export class UpdateChantierDto extends PartialType(CreateChantierDto) {}
