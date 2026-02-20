import { IsString, IsNumber, IsDate, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @IsString()
  pickupAddress: string;

  @IsNumber()
  pickupLat: number;

  @IsNumber()
  pickupLng: number;

  @Type(() => Date)
  @IsDate()
  pickupDate: Date;

  @IsString()
  pickupTimeSlot: string;

  @IsNumber()
  @Min(1)
  numberOfBags: number;

  @IsNumber()
  @Min(1)
  storageDays: number;

  @IsString()
  deliveryAddress: string;

  @IsNumber()
  deliveryLat: number;

  @IsNumber()
  deliveryLng: number;

  @Type(() => Date)
  @IsDate()
  deliveryDate: Date;

  @IsString()
  deliveryTimeSlot: string;

  @IsOptional()
  @IsString()
  specialInstructions?: string;
}