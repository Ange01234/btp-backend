import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';
import { Role } from '../enums/role.enum';

@Schema({ timestamps: true })
export class User extends Document {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    example: 'password123',
    description: 'The password of the user',
    format: 'password',
  })
  @Prop({ required: true })
  password: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'The name of the user',
    required: false,
  })
  @Prop()
  name?: string;

  @ApiProperty({
    example: 'Acme Corporation',
    description: 'The company of the user',
    required: false,
  })
  @Prop()
  company?: string;

  @ApiProperty({
    example: false,
    description: 'Whether the user account is active',
    default: false,
  })
  @Prop({ default: false })
  isActive: boolean;

  @ApiProperty({
    example: Role.USER,
    description: 'The role of the user',
    enum: Role,
    default: Role.USER,
  })
  @Prop({ type: String, enum: Role, default: Role.USER })
  role: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
