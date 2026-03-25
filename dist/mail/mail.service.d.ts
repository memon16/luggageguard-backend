export declare class MailService {
    private resend;
    constructor();
    sendBookingConfirmation(booking: any, userEmail: string, userName: string): Promise<void>;
    sendStatusUpdate(booking: any, userEmail: string, userName: string, newStatus: string): Promise<void>;
}
