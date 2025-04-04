import { Controller, Post, Get, Delete, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReservationsService } from './reservation.service';


@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post(':eventId')
  async create(@Request() req, @Param('eventId') eventId: string) {
    const userId = req.user.userId;
    return this.reservationsService.create(req.user.userId, eventId);
  }

  @Get()
  async findByUser(@Request() req) {
    return this.reservationsService.findByUser(req.user.userId);
  }

  @Get('/all') // Mostrar todas las reservas (Solo para administradores)
  async findAll() {
    return this.reservationsService.findAll();
  }

  @Delete(':reservationId')
  async delete(@Request() req, @Param('reservationId') reservationId: string) {
    return this.reservationsService.delete(req.user.userId, reservationId);
  }
}
