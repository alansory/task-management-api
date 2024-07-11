import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import {
  LoginUserRequest,
  RegisterUserRequest,
  UserResponse,
} from '../model/user.model';
import { WebResponse } from 'src/model/web.model';
import { PrismaService } from '../common/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) {}

  async signIn(request: LoginUserRequest): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.login(request);
    return {
      access_token: await this.jwtService.signAsync(user),
        ...user
    };
  }

  async loginWithGoogle({
    email,
    name,
  }: {
    email: string;
    name: string;
  }) : Promise<WebResponse<UserResponse>> {
    const user = await this.prismaService.user.findFirst({ 
      where: {
        email: email 
      }
    });
    if (!user) {
      const username = email.split('@')[0];
      const hashedPassword = await bcrypt.hash(String(generateRandomString(6)), 10);
      const userCreateInput = {
        email: email,
        name: name || '',
        username: username, 
        password: hashedPassword
      };
  
      const user = await this.prismaService.user.create({
        data: userCreateInput,
      });
      return {
        access_token: await this.jwtService.signAsync(user),
        data:{
          ...user
        }
      }
    } else {
      return {
        access_token: await this.jwtService.signAsync(user),
        data:{
          ...user
        }
      }
    }
  }

  async register(request: RegisterUserRequest): Promise<WebResponse<UserResponse>> {
    const user = await this.userService.register(request);
    return user
  }
}

function generateRandomString(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}