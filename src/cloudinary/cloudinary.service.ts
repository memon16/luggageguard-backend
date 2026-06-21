import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async uploadImage(fileBuffer: Buffer, bookingId: string): Promise<string> {
    console.log('CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
    console.log('API_KEY:', process.env.CLOUDINARY_API_KEY);
    console.log('API_SECRET exists:', !!process.env.CLOUDINARY_API_SECRET);

    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'luggageguard',
          public_id: `booking_${bookingId}_${Date.now()}`,
          resource_type: 'image',
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result.secure_url);
        }
      ).end(fileBuffer);
    });
  }
}