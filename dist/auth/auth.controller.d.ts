import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: any;
        };
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
            user: any;
        };
        message: string;
    }>;
    refresh(refreshToken: string): Promise<{
        success: boolean;
        data: {
            accessToken: string;
            refreshToken: string;
        };
    }>;
    getCurrentUser(req: any): Promise<{
        success: boolean;
        data: any;
    }>;
}
