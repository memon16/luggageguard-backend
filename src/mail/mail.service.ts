import { Injectable } from '@nestjs/common';
import { Resend } from 'resend';

@Injectable()
export class MailService {
  private resend: Resend;

  constructor() {
    this.resend = new Resend(process.env.RESEND_API_KEY);
  }

  async sendBookingConfirmation(booking: any, userEmail: string, userName: string) {
    await this.resend.emails.send({
      from: 'LuggageGuard <onboarding@resend.dev>',
      to: userEmail,
      subject: '✅ Booking Confirmed - LuggageGuard',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">LuggageGuard 🧳</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2>Hi ${userName}! Your booking is confirmed.</h2>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p><strong>Booking ID:</strong> #${booking.id.slice(0, 8).toUpperCase()}</p>
              <p><strong>📍 Pickup:</strong> ${booking.pickupAddress}</p>
              <p><strong>📅 Pickup Date:</strong> ${new Date(booking.pickupDate).toLocaleDateString()} • ${booking.pickupTimeSlot}</p>
              <p><strong>🎒 Bags:</strong> ${booking.numberOfBags}</p>
              <p><strong>📦 Storage:</strong> ${booking.storageDays} day(s)</p>
              <p><strong>🚚 Delivery:</strong> ${booking.deliveryAddress}</p>
              <p><strong>📅 Delivery Date:</strong> ${new Date(booking.deliveryDate).toLocaleDateString()} • ${booking.deliveryTimeSlot}</p>
              <hr/>
              <p style="font-size: 20px;"><strong>Total: $${Number(booking.totalPrice).toFixed(2)}</strong></p>
            </div>
            <p>We will contact you before pickup. Thank you for choosing LuggageGuard!</p>
          </div>
        </div>
      `,
    });
  }

  async sendStatusUpdate(booking: any, userEmail: string, userName: string, newStatus: string) {
    const statusMessages: Record<string, string> = {
      CONFIRMED: '✅ Your booking has been confirmed!',
      PICKED_UP: '🚗 Your bags have been picked up!',
      IN_STORAGE: '📦 Your bags are safely stored!',
      OUT_FOR_DELIVERY: '🚚 Your bags are out for delivery!',
      DELIVERED: '🎉 Your bags have been delivered!',
      CANCELLED: '❌ Your booking has been cancelled.',
    };

    const message = statusMessages[newStatus] || `Your booking status: ${newStatus}`;

    await this.resend.emails.send({
      from: 'LuggageGuard <bookings@luggageguard.miami>',
      to: userEmail,
      subject: `${message} - LuggageGuard`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #2563eb; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0;">LuggageGuard 🧳</h1>
          </div>
          <div style="padding: 30px; background: #f9fafb;">
            <h2>${message}</h2>
            <div style="background: white; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p><strong>Booking ID:</strong> #${booking.id.slice(0, 8).toUpperCase()}</p>
              <p><strong>📍 Pickup:</strong> ${booking.pickupAddress}</p>
              <p><strong>🚚 Delivery:</strong> ${booking.deliveryAddress}</p>
              <p><strong>🎒 Bags:</strong> ${booking.numberOfBags}</p>
            </div>
            <p>Thank you for choosing LuggageGuard!</p>
          </div>
        </div>
      `,
    });
  }
}