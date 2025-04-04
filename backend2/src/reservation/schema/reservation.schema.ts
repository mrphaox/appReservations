import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Reservation extends Document {
  @Prop({ required: true })
  eventId: string;

  @Prop({ required: true })
  userId: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
