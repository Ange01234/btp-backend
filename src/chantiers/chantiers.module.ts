import { Module } from '@nestjs/common';
import { ChantiersService } from './chantiers.service';
import { ChantiersController } from './chantiers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chantier, ChantierSchema } from './schemas/chantier.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chantier.name, schema: ChantierSchema },
    ]),
  ],
  providers: [ChantiersService],
  controllers: [ChantiersController],
})
export class ChantiersModule {}
