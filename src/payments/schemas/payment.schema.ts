import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema({ timestamps: true })
export class Payment extends Document {
  @ApiProperty({ description: 'The chantier ID associated with this payment' })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chantier',
    required: true,
  })
  chantierId: string;

  @ApiProperty({ example: 2000000, description: 'Amount received' })
  @Prop({ required: true })
  amount: number;

  @ApiProperty({ example: '2025-02-01', description: 'Date of payment' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({
    example: 'Virement',
    enum: ['Virement', 'Chèque', 'Espèces', 'Mobile Money'],
  })
  @Prop({ required: true })
  method: string; // "Virement" | "Chèque" | "Espèces" | "Mobile Money"

  @ApiProperty({ description: 'The user ID associated with this payment' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
