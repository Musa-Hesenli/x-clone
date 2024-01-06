import { IsNotEmpty, Max, MaxLength } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  postId: number;

  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @MaxLength(1000)
  description: string;
}