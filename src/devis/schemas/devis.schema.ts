import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document, Schema as MongooseSchema } from 'mongoose';

@Schema()
class LineItem {
  @ApiProperty({ example: 'Ciment', description: 'Designation of the item' })
  @Prop({ required: true })
  designation: string;

  @ApiProperty({ example: 10, description: 'Quantity' })
  @Prop({ required: true })
  quantity: number;

  @ApiProperty({ example: 4500, description: 'Unit price' })
  @Prop({ required: true })
  unitPrice: number;
}

const LineItemSchema = SchemaFactory.createForClass(LineItem);

@Schema({ timestamps: true })
export class Devis extends Document {
  @ApiProperty({ description: 'The chantier ID associated with this devis' })
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Chantier',
    required: true,
  })
  chantierId: string;

  @ApiProperty({ example: '2025-01-15', description: 'Date of the devis' })
  @Prop({ required: true })
  date: Date;

  @ApiProperty({
    example: 'Brouillon',
    enum: ['Brouillon', 'Envoyé', 'Accepté', 'Refusé'],
  })
  @Prop({ required: true, default: 'Brouillon' })
  status: string; // "Brouillon" | "Envoyé" | "Accepté" | "Refusé"

  @ApiProperty({ type: [LineItem], description: 'List of items in the devis' })
  @Prop({ type: [LineItemSchema], default: [] })
  lineItems: LineItem[];

  @ApiProperty({ example: 0.18, description: 'TVA rate' })
  @Prop({ default: 0.18 })
  tvaRate: number;

  @ApiProperty({ description: 'The user ID associated with this devis' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: string;
}

export const DevisSchema = SchemaFactory.createForClass(Devis);
