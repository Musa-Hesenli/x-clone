import { SignInDto } from './dto/signIn.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/users.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt'
import { HttpException, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { responses } from '../../helpers/helpers';
import { JwtService } from '@nestjs/jwt';

export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  public async login(params: SignInDto) {
    const user = await this.userRepo.findOneBy({
      email: params.email
    });

    if (!user) {
      throw new HttpException("Email or password is incorrect!", HttpStatus.BAD_REQUEST)
    }

    const matches = await bcrypt.compare(params.password, user.password);
    if (!matches) {
      throw new HttpException("Email or password is incorrect", HttpStatus.BAD_REQUEST)
    }
    const {password, ...remaining} = user;
    const jwtToken = await this.jwtService.signAsync(remaining);

    return responses.data({
      access_token: jwtToken,
      expiresOn: new Date(Date.now() + (60 * 60 * 1000))
    });
  }

  public async register(params: RegisterDto) {
    const userExistsWithEmail = await this.userRepo.createQueryBuilder('user')
      .where('user.email = :email OR user.username = :username', {
        email: params.email,
        username: params.username
      })
      .getExists();

    if (userExistsWithEmail) {
      throw new HttpException("Email or username is already taken", HttpStatus.BAD_REQUEST)
    }

    const hashedPassword = await bcrypt.hash(params.password, 10);

    const user = this.userRepo.create({
      firstName: params.firstName,
      lastName: params.lastName,
      username: params.username,
      email: params.email,
      password: hashedPassword
    });

    const result = await this.userRepo.save(user);
    const {password, ...remaining} = result;
    const jwtToken = await this.jwtService.signAsync(remaining)

    return responses.data({
      access_token: jwtToken,
      expiresOn: new Date(Date.now() + (60 * 60 * 1000))
    })
  }
}