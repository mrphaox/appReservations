import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { EventsModule } from '../events/events.module';
import { ReservationsController } from './reservation.controller';
import { ReservationsService } from './reservation.service';
import { Reservation, ReservationSchema } from './schema/reservation.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Reservation.name, schema: ReservationSchema }]),
    EventsModule, 
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
