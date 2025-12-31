import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Expense extends Document {
  @ApiProperty({ description: 'The chantier ID associated with this expense' })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chantier',
    required: true,
  })
  chantierId: string;

  @ApiProperty({
    example: 'matériaux',
    enum: ['matériaux', 'main-d’œuvre', 'transport', 'autre'],
  })
  @Prop({ required: true })
  type: string; // "matériaux" | "main-d’œuvre" | "transport" | "autre"

  @ApiProperty({
    example: 'Achat de gravier',
    description: 'Description of the expense',
  })
  @Prop({ required: true })
  description: string;

  @ApiProperty({ example: 150000, description: 'Amount of the expense' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({
    example: 'Fournisseur X',
    description: 'Provider of the goods or services',
  })
  @Prop({ required: true })
  provider: string;

  @ApiProperty({ example: '2025-01-20', description: 'Date of the expense' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({
    example: 'https://storage.example.com/proof.jpg',
    description: 'URL to the proof of expense',
    required: false,
  })
  @Prop()
  proofUrl?: string;

  @ApiProperty({ description: 'The user ID associated with this expense' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const ExpenseSchema = SchemaFactory.createForClass(Expense);
