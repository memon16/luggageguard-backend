import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('create-intent')
  createPaymentIntent(@Body() body: { bookingId: string }, @Request() req: any) {
    return this.paymentsService.createPaymentIntent(body.bookingId, req.user.id);
  }
}