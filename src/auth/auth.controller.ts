import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorators';
import { LoginUserRequest } from 'src/model/user.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() request: LoginUserRequest
  ) {
    return this.authService.signIn(request);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('register')
  async register(
    @Body() request: LoginUserRequest
  ) {
    return this.authService.register(request);
  }

  @HttpCode(HttpStatus.OK)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}