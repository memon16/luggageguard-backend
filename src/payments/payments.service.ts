import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    });
  }

  async createPaymentIntent(bookingId: string, userId: string) {
    const booking = await this.prisma.booking.findFirst({
      where: { id: bookingId, userId },
    });

    if (!booking) {
      throw new NotFoundException('Reserva no encontrada');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: Math.round(Number(booking.totalPrice) * 100),
      currency: 'usd',
      metadata: { bookingId, userId },
    });

    return { 
      success: true, 
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: booking.totalPrice
    };
  }

  async confirmPayment(paymentIntentId: string, bookingId: string) {
    const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === 'succeeded') {
      const payment = await this.prisma.payment.create({
        data: {
          bookingId,
          amount: paymentIntent.amount / 100,
          currency: 'usd',
          status: 'SUCCEEDED',
          stripePaymentIntentId: paymentIntentId,
        },
      });

      await this.prisma.booking.update({
        where: { id: bookingId },
        data: { status: 'CONFIRMED' },
      });

      return { success: true, payment };
    }

    return { success: false, status: paymentIntent.status };
  }
}