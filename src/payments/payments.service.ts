import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async createPaymentIntent(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }

    // Simular pago exitoso por ahora
    const payment = await this.prisma.payment.create({
      data: {
        bookingId,
        amount: booking.totalPrice,
        currency: 'usd',
        status: 'SUCCEEDED',
        stripePaymentIntentId: `pi_test_${Date.now()}`,
      },
    });

    await this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CONFIRMED' },
    });

    return { success: true, payment };
  }
}