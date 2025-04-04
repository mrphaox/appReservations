import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
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

    if (!event) throw new NotFoundException('El evento no existe.');

   // if (event.participants.includes(userId)) {
   //   throw new BadRequestException('Ya estás registrado en este evento.');
   //  }

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

  async findAll(): Promise<Reservation[]> {
    return this.reservationModel.find().exec();
  }

  async delete(userId: string, reservationId: string): Promise<void> {
    const reservation = await this.reservationModel.findById(reservationId).exec();

    if (!reservation) throw new NotFoundException('La reserva no existe.');

    if (reservation.userId !== userId) throw new BadRequestException('No puedes eliminar esta reserva.');

    // Remover al usuario de la lista de participantes en el evento
    const event = await this.eventsService.findOne(reservation.eventId);
    if (event) {
      event.participants = event.participants.filter(id => id !== userId);
      await this.eventsService.update(event._id as string, { participants: event.participants });
    }

    await this.reservationModel.deleteOne({ _id: reservationId });
  }
}
