import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event } from './schema/event.schema';


@Injectable()
export class EventsService {
  constructor(@InjectModel(Event.name) private eventModel: Model<Event>) {}

  async create(eventData): Promise<Event> {
    const event = new this.eventModel(eventData);
    return event.save();
  }

  async findAll(userId: string): Promise<Event[]> {
    return this.eventModel.find({ userId }).exec();
  }

  async findAllEvents(): Promise<Event[]> {  // Nueva función para obtener todos los eventos
    return this.eventModel.find().exec();
  }

  async findOne(id: string): Promise<Event> {
    const event = await this.eventModel.findById(id).exec();
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  async update(id: string, updateData): Promise<Event> {
    const event = await this.eventModel.findByIdAndUpdate(id, updateData, { new: true }).exec();
    if (!event) throw new NotFoundException('Evento no encontrado');
    return event;
  }

  async delete(id: string): Promise<void> {
    const result = await this.eventModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException('Evento no encontrado');
  }
}
