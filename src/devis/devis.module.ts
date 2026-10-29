import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Devis, DevisSchema } from './schemas/devis.schema';
import { Chantier, ChantierSchema } from '../chantiers/schemas/chantier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Devis.name, schema: DevisSchema },
      { name: Chantier.name, schema: ChantierSchema },
    ]),
  ],
  providers: [DevisService],
  controllers: [DevisController],
})
export class DevisModule {}
