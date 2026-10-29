import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Chantier extends Document {
  @ApiProperty({
    example: 'Construction Villa',
    description: 'The name of the chantier',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    example: 'Client Name',
    description: 'The name of the client',
  })
  @Prop({ required: true })
  client: string;

  @ApiProperty({
    example: 'Abidjan, Ivory Coast',
    description: 'The location of the chantier',
  })
  @Prop({ required: true })
  location: string;

  @ApiProperty({
    example: '2025-01-01',
    description: 'Start date of the chantier',
  })
  @Prop({ required: true })
  startDate: Date;

  @ApiProperty({
    example: '2025-12-31',
    description: 'End date of the chantier',
    required: false,
  })
  @Prop()
  endDate?: Date;

  @ApiProperty({ example: 5000000, description: 'Budget for the chantier' })
  @Prop({ required: true })
  budget: number;

  @ApiProperty({
    example: 'En cours',
    enum: ['En cours', 'Terminé', 'Suspendu'],
  })
  @Prop({ required: true, default: 'En cours' })
  status: string; // "En cours" | "Terminé" | "Suspendu"

  @ApiProperty({ description: 'The user ID associated with this chantier (Owner)' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @ApiProperty({
    description: 'List of spectators with read-only access',
    type: 'array',
  })
  @Prop({
    type: [
      {
        userId: { type: MongooseSchema.Types.ObjectId, ref: 'User', required: true },
        email: { type: String, required: true },
        name: { type: String, required: false },
        company: { type: String, required: false },
        addedAt: { type: Date, default: Date.now },
      },
    ],
    default: [],
  })
  spectators: Array<{
    userId: string;
    email: string;
    name?: string;
    company?: string;
    addedAt?: Date;
  }>;

  @Prop({ default: false })
  isDeleted: boolean;
}

export const ChantierSchema = SchemaFactory.createForClass(Chantier);
