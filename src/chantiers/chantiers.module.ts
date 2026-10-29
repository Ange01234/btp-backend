import { Module } from '@nestjs/common';
import { ChantiersService } from './chantiers.service';
import { ChantiersController } from './chantiers.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chantier, ChantierSchema } from './schemas/chantier.schema';
import { User, UserSchema } from '../auth/schemas/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chantier.name, schema: ChantierSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  providers: [ChantiersService],
  controllers: [ChantiersController],
  exports: [ChantiersService, MongooseModule],
})
export class ChantiersModule {}
