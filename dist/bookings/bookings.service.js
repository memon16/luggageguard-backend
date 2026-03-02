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
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../common/prisma/prisma.service");
let BookingsService = class BookingsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(userId, createBookingDto) {
        const pricing = await this.prisma.pricingConfig.findFirst({
            where: { isActive: true },
            orderBy: { effectiveFrom: 'desc' },
        });
        if (!pricing) {
            throw new common_1.NotFoundException('Configuración de precios no encontrada');
        }
        const basePrice = Number(pricing.basePricePerBag) * createBookingDto.numberOfBags;
        const storagePrice = Number(pricing.pricePerDayPerBag) *
            createBookingDto.numberOfBags *
            createBookingDto.storageDays;
        let totalPrice = basePrice + storagePrice;
        let discountApplied = 0;
        const discountTiers = pricing.multiDayDiscountTiers;
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
        return booking;
    }
    async findAll(userId, userRole) {
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
                    },
                },
                payment: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findOne(id, userId, userRole) {
        const where = { id };
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
            throw new common_1.NotFoundException('Reserva no encontrada');
        }
        return booking;
    }
    async getDashboardStats(userId, userRole) {
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
        const totalRevenue = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
        return {
            totalBookings,
            activeBookings,
            completedBookings,
            totalRevenue,
        };
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map