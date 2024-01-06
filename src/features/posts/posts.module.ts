import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { AwsService } from '../../config/AwsConfig';

@Module({
  controllers: [PostsController],
  providers: [PostsService, AwsService]
})
export class PostsModule{}