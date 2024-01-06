import {
  Body,
  Controller,
  Param,
  ParseFilePipeBuilder,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { responses, utils } from '../../helpers/helpers';
import { CreatePostDto } from './dto/createPost.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { AwsService } from '../../config/AwsConfig';
import { PutObjectCommand } from '@aws-sdk/client-s3';

@Controller('posts')
export class PostsController {
  public constructor(private readonly awsService: AwsService) {}

  public list() {
    return responses.data('list')
  }

  @UseInterceptors(FileInterceptor('file'))
  @Post('create')
  public async create(@Body() createPostDto: CreatePostDto, @UploadedFile(
    new ParseFilePipeBuilder()
      .addFileTypeValidator({
        fileType: 'image/jpeg'
      })
      .build({
        fileIsRequired: true
      })
  ) file : Express.Multer.File) {
    const imageName = utils.generateRandomBytes() + '.jpg';

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageName,
      Body: file.buffer,
      ContentType: 'image/jpeg'
    });
    await this.awsService.getS3Client().send(command);
    const signedUrl = this.awsService.signImageUrl(imageName);
    return responses.data({
      url: signedUrl
    })
  };

  @Post('update/:id')
  public update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return responses.data('update')
  }

  @Post('delete/:id')
  public delete(@Param('id') id: number) {

  }
}