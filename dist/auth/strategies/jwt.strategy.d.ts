import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../common/prisma/prisma.service';
declare const JwtStrategy_base: new (...args: any[]) => Strategy;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(payload: any): Promise<{
        id: string;
        email: string;
        phone: string | null;
        firstName: string;
        lastName: string;
        passwordHash: string | null;
        googleId: string | null;
        appleId: string | null;
        profileImage: string | null;
        role: import(".prisma/client").$Enums.UserRole;
        emailVerified: boolean;
        phoneVerified: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
export {};
