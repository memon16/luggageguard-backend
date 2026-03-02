import { PrismaService } from '../common/prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsService {
    private prisma;
    constructor(prisma: PrismaService);
    create(userId: string, createBookingDto: CreateBookingDto): Promise<{
        user: {
            id: string;
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
        };
    } & {
        id: string;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        pickupDate: Date;
        pickupTimeSlot: string;
        numberOfBags: number;
        storageDays: number;
        deliveryAddress: string;
        deliveryLat: number;
        deliveryLng: number;
        deliveryDate: Date;
        deliveryTimeSlot: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        storagePrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        discountApplied: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.BookingStatus;
        pickupConfirmedAt: Date | null;
        storageConfirmedAt: Date | null;
        deliveryConfirmedAt: Date | null;
        specialInstructions: string | null;
        internalNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        operatorId: string | null;
    }>;
    findAll(userId: string, userRole: string): Promise<({
        user: {
            id: string;
            email: string;
            firstName: string;
            lastName: string;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            stripePaymentIntentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            paymentMethod: string | null;
            receiptUrl: string | null;
        };
    } & {
        id: string;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        pickupDate: Date;
        pickupTimeSlot: string;
        numberOfBags: number;
        storageDays: number;
        deliveryAddress: string;
        deliveryLat: number;
        deliveryLng: number;
        deliveryDate: Date;
        deliveryTimeSlot: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        storagePrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        discountApplied: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.BookingStatus;
        pickupConfirmedAt: Date | null;
        storageConfirmedAt: Date | null;
        deliveryConfirmedAt: Date | null;
        specialInstructions: string | null;
        internalNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        operatorId: string | null;
    })[]>;
    findOne(id: string, userId: string, userRole: string): Promise<{
        user: {
            id: string;
            email: string;
            phone: string;
            firstName: string;
            lastName: string;
        };
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            bookingId: string;
            stripePaymentIntentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            paymentMethod: string | null;
            receiptUrl: string | null;
        };
    } & {
        id: string;
        pickupAddress: string;
        pickupLat: number;
        pickupLng: number;
        pickupDate: Date;
        pickupTimeSlot: string;
        numberOfBags: number;
        storageDays: number;
        deliveryAddress: string;
        deliveryLat: number;
        deliveryLng: number;
        deliveryDate: Date;
        deliveryTimeSlot: string;
        basePrice: import("@prisma/client/runtime/library").Decimal;
        storagePrice: import("@prisma/client/runtime/library").Decimal;
        totalPrice: import("@prisma/client/runtime/library").Decimal;
        discountApplied: import("@prisma/client/runtime/library").Decimal;
        status: import(".prisma/client").$Enums.BookingStatus;
        pickupConfirmedAt: Date | null;
        storageConfirmedAt: Date | null;
        deliveryConfirmedAt: Date | null;
        specialInstructions: string | null;
        internalNotes: string | null;
        createdAt: Date;
        updatedAt: Date;
        userId: string;
        operatorId: string | null;
    }>;
    getDashboardStats(userId: string, userRole: string): Promise<{
        totalBookings: number;
        activeBookings: number;
        completedBookings: number;
        totalRevenue: number;
    }>;
}
