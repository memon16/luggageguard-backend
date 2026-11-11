import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MailService } from '../mail/mail.service';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const pricing = await this.prisma.pricingConfig.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!pricing) {
      throw new NotFoundException('Pricing configuration not found');
    }

        const bags = createBookingDto.numberOfBags;
    const days = createBookingDto.storageDays;

    const isSameDay =
      new Date(createBookingDto.pickupDate).toISOString().split('T')[0] ===
      new Date(createBookingDto.deliveryDate).toISOString().split('T')[0];

    const basePrice = Number(pricing.basePricePerBag) * bags;

    const storagePrice =
      isSameDay || days === 0
        ? 4 * bags
        : Number(pricing.pricePerDayPerBag) * bags * days;

    let subtotal = basePrice + storagePrice;
    let discountApplied = 0;

    if (!isSameDay && days > 0) {
      const discountTiers = (pricing.multiDayDiscountTiers as any[]) || [];
      for (const tier of discountTiers) {
        if (days >= tier.days) {
          discountApplied = subtotal * (tier.discount / 100);
        }
      }
    }

    if (bags >= 3) {
      discountApplied += subtotal * 0.05;
    }

    subtotal -= discountApplied;
    const tax = subtotal * 0.07;
    const totalPrice = Math.round((subtotal + tax) * 100) / 100;

    const booking = await this.prisma.booking.create({
      data: {
        userId,
        ...createBookingDto,
        basePrice,
        storagePrice,
        totalPrice,
        discountApplied,
        status: 'PENDING',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
      },
    });

    try {
      await this.mailService.sendBookingConfirmation(
        booking,
        booking.user.email,
        booking.user.firstName,
      );
    } catch (e) {
      console.error('Error sending confirmation email:', e);
    }

    try {
      await this.mailService.sendAdminNewBooking(
        booking,
        booking.user.email,
        `${booking.user.firstName} ${booking.user.lastName}`,
        booking.user.phone,
      );
    } catch (e) {
      console.error('Error sending admin notification:', e);
    }

    return booking;
  }

  async findAll(userId: string, userRole: string) {
    const where = userRole === 'CLIENT' ? { userId } : {};

    return this.prisma.booking.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payment: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string, userId: string, userRole: string) {
    const where: any = { id };
    if (userRole === 'CLIENT') {
      where.userId = userId;
    }

    const booking = await this.prisma.booking.findFirst({
      where,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
          },
        },
        payment: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    return booking;
  }

  async getDashboardStats(userId: string, userRole: string) {
    const where = userRole === 'CLIENT' ? { userId } : {};

    const [totalBookings, activeBookings, completedBookings] = await Promise.all([
      this.prisma.booking.count({ where }),
      this.prisma.booking.count({
        where: {
          ...where,
          status: {
            in: ['PENDING', 'CONFIRMED', 'PICKED_UP', 'IN_STORAGE', 'OUT_FOR_DELIVERY'],
          },
        },
      }),
      this.prisma.booking.count({
        where: { ...where, status: 'DELIVERED' },
      }),
    ]);

    const payments = await this.prisma.payment.findMany({
      where: {
        booking: where,
        status: 'SUCCEEDED',
      },
      select: { amount: true },
    });

    const totalRevenue = payments.reduce(
      (sum, payment) => sum + Number(payment.amount),
      0
    );

    return {
      totalBookings,
      activeBookings,
      completedBookings,
      totalRevenue,
    };
  }

         async updateStatus(id: string, userId: string, userRole: string, status: string) {
    const isStaff = userRole === 'ADMIN' || userRole === 'OPERATOR';

    const booking = await this.prisma.booking.findFirst({
      where: isStaff ? { id } : { id, userId },
      include: {
        user: {
          select: { email: true, firstName: true }
        }
      }
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (!isStaff) {
      if (status !== 'CANCELLED' || booking.status !== 'PENDING') {
        throw new ForbiddenException('You can only cancel your own pending bookings');
      }
    }

    const updated = await this.prisma.booking.update({
      where: { id },
      data: { status: status as any },
    });

    try {
      await this.mailService.sendStatusUpdate(
        booking,
        booking.user.email,
        booking.user.firstName,
        status,
      );
    } catch (e) {
      console.error('Error sending status email:', e);
    }

    if (status === 'DELIVERED') {
      try {
        await this.mailService.sendInvoice(
          booking,
          booking.user.email,
          booking.user.firstName,
        );
      } catch (e) {
        console.error('Error sending invoice:', e);
      }
    }

    return updated;
  }
async updateAddress(
    id: string,
    userId: string,
    data: { pickupAddress?: string; deliveryAddress?: string },
  ) {
    const booking = await this.prisma.booking.findFirst({
      where: { id, userId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.status !== 'PENDING') {
      throw new BadRequestException('Only PENDING bookings can be edited');
    }

    return this.prisma.booking.update({
      where: { id },
      data: {
        ...(data.pickupAddress && { pickupAddress: data.pickupAddress }),
        ...(data.deliveryAddress && { deliveryAddress: data.deliveryAddress }),
      },
    });
  }
  async uploadPhoto(bookingId: string, fileBuffer: Buffer) {
    const photoUrl = await this.cloudinaryService.uploadImage(fileBuffer, bookingId);

    const booking = await this.prisma.booking.update({
      where: { id: bookingId },
      data: { photoUrl },
    });

    return booking;
  }
}