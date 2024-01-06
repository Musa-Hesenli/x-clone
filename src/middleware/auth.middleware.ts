import { HttpStatus, Injectable, NestMiddleware } from '@nestjs/common';
import { responses } from '../helpers/helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware{
  constructor(private readonly jwtService: JwtService) {
  }

  async use(req: any, res: any, next: (error?: any) => void): Promise<any> {
    try {
      const [_, token] = req.headers.authorization.split(' ') || [];
      if (!token) {
        return res.status(HttpStatus.BAD_REQUEST).send(responses.error('Unauthenticated', HttpStatus.BAD_REQUEST));
      }
      await this.jwtService.verifyAsync(token);
      next();
    } catch (e) {
      return res.status(HttpStatus.BAD_REQUEST).send(responses.error(e.message, HttpStatus.BAD_REQUEST));
    }
  }
}