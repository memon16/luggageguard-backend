export declare class CreateBookingDto {
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
    specialInstructions?: string;
}
