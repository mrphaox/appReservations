import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EventsService } from '../events/events.service';
import { Reservation } from './schema/reservation.schema';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectModel(Reservation.name) private reservationModel: Model<Reservation>,
    private eventsService: EventsService,
  ) {}

  async create(userId: string, eventId: string): Promise<Reservation> {
    const event = await this.eventsService.findOne(eventId);

    if (event.participants.length >= event.limit) {
      throw new BadRequestException('El evento ya está lleno.');
    }

    const reservation = new this.reservationModel({ userId, eventId });
    await reservation.save();

    event.participants.push(userId);
    await this.eventsService.update(eventId, { participants: event.participants });

    return reservation;
  }

  async findByUser(userId: string): Promise<Reservation[]> {
    return this.reservationModel.find({ userId }).exec();
  }
}
