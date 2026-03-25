"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
const stripe_1 = require("stripe");
let PaymentsService = class PaymentsService {
    constructor(prisma) {
        this.prisma = prisma;
        this.stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2023-10-16',
        });
    }
    async createPaymentIntent(bookingId, userId) {
        const booking = await this.prisma.booking.findFirst({
            where: { id: bookingId, userId },
        });
        if (!booking) {
            throw new common_1.NotFoundException('Reserva no encontrada');
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
    async confirmPayment(paymentIntentId, bookingId) {
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
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map