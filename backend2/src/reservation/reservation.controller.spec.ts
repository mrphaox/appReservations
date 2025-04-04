import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsService } from './reservation.service';
import { EventsService } from '../events/events.service';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Reservation } from './schema/reservation.schema';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockEventService = {
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockReservationModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        { provide: EventsService, useValue: mockEventService },
        { provide: getModelToken(Reservation.name), useValue: mockReservationModel },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('Debe estar definido', () => {
    expect(service).toBeDefined();
  });
});
