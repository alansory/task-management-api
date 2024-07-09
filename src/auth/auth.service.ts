import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from 'src/model/web.model';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn(request: LoginUserRequest): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.login(request);
    return {
      access_token: await this.jwtService.signAsync(user),
      data: {
        ...user
      }
    };
  }

  async register(request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.register(request);
    return {
      data: user
    };
  }
}