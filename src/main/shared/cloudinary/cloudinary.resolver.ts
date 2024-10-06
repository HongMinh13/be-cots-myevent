import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CloudinaryService } from './cloudinary.service';
import { UploadRequest } from './dto/request/uploadParam.request';

@Resolver()
export class CloudinaryResolver {
  constructor(private readonly service: CloudinaryService) {}

  @Mutation(() => String)
  async uploadImage(@Args('input') input: UploadRequest): Promise<string> {
    const uploadedImage = await this.service.uploadImageToCloudinary(input);
    return uploadedImage.url;
  }
}
