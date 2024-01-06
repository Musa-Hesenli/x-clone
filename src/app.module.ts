import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from './features/auth/auth.module';
import { UsersModule } from './features/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalExceptionFilter } from './exception';
import { APP_FILTER } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';
import { AuthMiddleware } from './middleware/auth.middleware';
import { PostsModule } from './features/posts/posts.module';

@Module({
  imports: [
      ConfigModule.forRoot({
        isGlobal: true
      }),
      AuthModule,
      UsersModule,
      PostsModule,
      TypeOrmModule.forRoot({
        type: 'postgres',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT,
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        autoLoadEntities: true,
        synchronize: ['development', 'test'].includes(process.env.NODE_ENV),
      }),
      JwtModule.register({
        global: true,
        secret: process.env.JWT_SECRET,
        signOptions: {
          expiresIn: '1h'
        }
      })
  ],
  providers: [
    {
      useClass: GlobalExceptionFilter,
      provide: APP_FILTER
    }
  ]
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AuthMiddleware)
      .exclude(
        {path: 'auth/login', method: RequestMethod.POST},
        {path: 'auth/register', method: RequestMethod.POST}
      )
      .forRoutes('*')
  }
}
