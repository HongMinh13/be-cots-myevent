import { CLOUDINARY, configuration } from '@/config';
import { v2 } from 'cloudinary';

export const CloudinaryProvider = {
  provide: CLOUDINARY,
  useFactory: () => {
    return v2.config({
      cloud_name: configuration.cloudinaryService.name,
      api_key: configuration.cloudinaryService.key,
      api_secret: configuration.cloudinaryService.secret,
    });
  },
};
