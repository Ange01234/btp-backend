import { Module } from '@nestjs/common';
import { DevisService } from './devis.service';
import { DevisController } from './devis.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Devis, DevisSchema } from './schemas/devis.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Devis.name, schema: DevisSchema }]),
  ],
  providers: [DevisService],
  controllers: [DevisController],
})
export class DevisModule {}
