import { PaymentsService } from './payments.service';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    createPaymentIntent(body: {
        bookingId: string;
    }, req: any): Promise<{
        success: boolean;
        clientSecret: string;
        paymentIntentId: string;
        amount: import("@prisma/client/runtime/library").Decimal;
    }>;
    confirmPayment(body: {
        paymentIntentId: string;
        bookingId: string;
    }): Promise<{
        success: boolean;
        payment: {
            id: string;
            status: import(".prisma/client").$Enums.PaymentStatus;
            createdAt: Date;
            updatedAt: Date;
            stripePaymentIntentId: string;
            amount: import("@prisma/client/runtime/library").Decimal;
            currency: string;
            paymentMethod: string | null;
            receiptUrl: string | null;
            bookingId: string;
        };
        status?: undefined;
    } | {
        success: boolean;
        status: "canceled" | "processing" | "requires_action" | "requires_capture" | "requires_confirmation" | "requires_payment_method";
        payment?: undefined;
    }>;
}
