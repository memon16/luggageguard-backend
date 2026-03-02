import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
export declare class BookingsController {
    private bookingsService;
    constructor(bookingsService: BookingsService);
    create(req: any, createBookingDto: CreateBookingDto): Promise<{
        success: boolean;
        data: {
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
        };
        message: string;
    }>;
    findAll(req: any): Promise<{
        success: boolean;
        data: ({
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
        })[];
    }>;
    getStats(req: any): Promise<{
        success: boolean;
        data: {
            totalBookings: number;
            activeBookings: number;
            completedBookings: number;
            totalRevenue: number;
        };
    }>;
    findOne(req: any, id: string): Promise<{
        success: boolean;
        data: {
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
        };
    }>;
}
