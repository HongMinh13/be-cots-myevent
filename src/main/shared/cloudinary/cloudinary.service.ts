import { BadRequestException, Injectable } from '@nestjs/common';
import { UploadApiErrorResponse, UploadApiResponse, v2 } from 'cloudinary';
import toStream = require('buffer-to-stream');
import { UploadRequest } from './dto/request/uploadParam.request';
import { configuration } from '@/config';

@Injectable()
export class CloudinaryService {
  async uploadImage(
    file: string,
    folderName: string,
  ): Promise<UploadApiResponse | UploadApiErrorResponse> {
    return new Promise((resolve, reject) => {
      const upload = v2.uploader.upload_stream(
        {
          folder: folderName,
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        },
      );

      toStream(file).pipe(upload);
    });
  }

  async uploadImageToCloudinary(input: UploadRequest) {
    const { folder, file } = input;
    const folderName = `${configuration.cloudinaryService.originFolder}/${folder}`;
    return await this.uploadImage(file, folderName).catch(() => {
      throw new BadRequestException('Invalid file type.');
    });
  }
}
