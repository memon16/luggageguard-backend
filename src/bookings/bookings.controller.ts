import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  UseGuards,
  Request 
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Post()
  async create(@Request() req, @Body() createBookingDto: CreateBookingDto) {
    const booking = await this.bookingsService.create(req.user.id, createBookingDto);
    return {
      success: true,
      data: booking,
      message: 'Reserva creada exitosamente',
    };
  }

  @Get()
  async findAll(@Request() req) {
    const bookings = await this.bookingsService.findAll(req.user.id, req.user.role);
    return {
      success: true,
      data: bookings,
    };
  }

  @Get('stats')
  async getStats(@Request() req) {
    const stats = await this.bookingsService.getDashboardStats(
      req.user.id,
      req.user.role
    );
    return {
      success: true,
      data: stats,
    };
  }

  @Get(':id')
  async findOne(@Request() req, @Param('id') id: string) {
    const booking = await this.bookingsService.findOne(id, req.user.id, req.user.role);
    return {
      success: true,
      data: booking,
    };
  }
}