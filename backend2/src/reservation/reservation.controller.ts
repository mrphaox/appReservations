import { Controller, Post, Get, Param, Request, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ReservationsService } from './reservation.service';


@Controller('reservations')
@UseGuards(JwtAuthGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post(':eventId')
  create(@Request() req, @Param('eventId') eventId: string) {
    return this.reservationsService.create(req.user.userId, eventId);
  }

  @Get()
  findByUser(@Request() req) {
    return this.reservationsService.findByUser(req.user.userId);
  }
}
