import { Controller, Get, Post, Body, Param, Delete, Patch, Request, UseGuards } from '@nestjs/common';
import { EventsService } from './events.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('events')
@UseGuards(JwtAuthGuard) // 🔒 Este protege TODAS las rutas de abajo
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Request() req, @Body() createEventDto) {
    return this.eventsService.create({ ...createEventDto, userId: req.user.userId });
  }

  @Get()
  findAll(@Request() req) {
    return this.eventsService.findAll(req.user.userId);
  }
  
  @Get('all')
  @UseGuards(JwtAuthGuard) 
  findAllEvents() {
    return this.eventsService.findAllEvents();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.eventsService.delete(id);
  }
}
