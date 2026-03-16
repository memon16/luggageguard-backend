import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { MailService } from '../mail/mail.service';

@Injectable()
export class BookingsService {
  constructor(
    private prisma: PrismaService,
    private mailService: MailService,
  ) {}

  async create(userId: string, createBookingDto: CreateBookingDto) {
    const pricing = await this.prisma.pricingConfig.findFirst({
      where: { isActive: true },
      orderBy: { effectiveFrom: 'desc' },
    });

    if (!pricing) {
      throw new NotFoundException('Pricing configuration not found');
    }

    const basePrice = Number(pricing.basePricePerBag) * createBookingDto.numberOfBags;
    const storagePrice = 
      Number(pricing.pricePerDayPerBag) * 
      createBookingDto.numberOfBags * 
      createBookingDto.storageDays;

    let totalPrice = basePrice + storagePrice;
    let discountApplied = 0;

    const discountTiers = (pricing.multiDayDiscountTiers as any[]) || [];
    for (const tier of discountTiers) {
      if (createBookingDto.storageDays >= tier.days) {
        discountApplied = totalPrice * (tier.discount / 100);
      }
    }

    totalPrice -= discountApplied;

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

async updateStatus(id: string, userId: string, status: string) {
  const booking = await this.prisma.booking.findFirst({
    where: { id },
    include: {
      user: {
        select: { email: true, firstName: true }
      }
    }
  });

  if (!booking) {
    throw new NotFoundException('Booking not found');
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

  return updated;
}
}