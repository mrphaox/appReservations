import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Event extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  limit: number;

  @Prop({ required: true })
  userId: string; // Usuario creador del evento

  @Prop({ type: [String], default: [] })
  participants: string[]; // Usuarios que reservaron
}

export const EventSchema = SchemaFactory.createForClass(Event);
