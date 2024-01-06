import { Body, Controller, Post } from '@nestjs/common';
import { SignInDto } from './dto/signIn.dto';
import { responses } from '../../helpers/helpers';
import { RegisterDto } from './dto/register.dto';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth'
})
export class AuthController {
  public constructor(private readonly authService: AuthService) {}


  @Post('login')
  public login(@Body() signInDto: SignInDto)
  {
    return this.authService.login(signInDto);
  }

  @Post('register')
  public register(@Body() registerDto: RegisterDto)
  {
    return this.authService.register(registerDto);
  }
}
