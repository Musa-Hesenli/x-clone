import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/users.entity';
@Module({
  providers: [
    AuthService,
  ],
  controllers: [AuthController],
  imports: [
    UsersModule,
    TypeOrmModule.forFeature([User]),
  ]
})
export class AuthModule {}
