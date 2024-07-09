import { HttpException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import {
  LoginUserRequest,
  RegisterUserRequest,
  SearchUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { UserValidation } from './user.validation';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { WebResponse } from '../model/web.model';

@Injectable()
export class UserService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async register(request: RegisterUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.register(${JSON.stringify(request)})`);
    const registerRequest: RegisterUserRequest =
      this.validationService.validate(UserValidation.REGISTER, request);

    const existingUser = await this.prismaService.user.findUnique({
      where: {
        email: registerRequest.email,
      },
      select: {
        id: true,
      },
    });
    if (existingUser) {
      throw new HttpException('Email already exists', 400);
    }

    const hashedPassword = await bcrypt.hash(String(registerRequest.password), 10);
    const username = registerRequest.email.split('@')[0];

    const userCreateInput = {
      email: registerRequest.email,
      name: registerRequest.name || null,
      username: username, 
      password: hashedPassword,
    };

    const user = await this.prismaService.user.create({
      data: userCreateInput,
    });
    return this.mapToUserResponse(user);
  }

  async login(request: LoginUserRequest): Promise<UserResponse> {
    this.logger.debug(`UserService.login(${JSON.stringify(request)})`);
    const loginRequest: LoginUserRequest = this.validationService.validate(
      UserValidation.LOGIN,
      request,
    );

    let user = await this.prismaService.user.findUnique({
      where: {
        email: loginRequest.email,
      },
    });

    const isPasswordValid = await bcrypt.compare(
      loginRequest.password,
      user.password,
    );

    if (!isPasswordValid || !user) {
      throw new UnauthorizedException();
    }

    return this.mapToUserResponse(user);
  }


  async update(user: User, request: UpdateUserRequest): Promise<UserResponse> {
    this.logger.debug(
      `UserService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );

    const updateRequest: UpdateUserRequest = this.validationService.validate(
      UserValidation.UPDATE,
      request,
    );

    if (updateRequest.name) {
      user.name = updateRequest.name;
    }

    if (updateRequest.password) {
      user.password = await bcrypt.hash(updateRequest.password, 10);
    }

    const updateUser = await this.prismaService.user.update({
      where: {
        email: user.email,
      },
      data: {
        email: user.email,
        name: user.name,
        username: user.username,
        password: user.password,
      },
    });
    return this.mapToUserResponse(updateUser);
  }

  async list(request: SearchUserRequest): Promise<WebResponse<UserResponse[]>> {
    const whereClause: any = {};

    if (request?.id) {
      whereClause.id = request.id;
    }

    if (request?.email) {
      whereClause.email = request.email;
    }

    const page = request.page ?? 1;
    const perPage = request.per_page ?? 10;
    const skip = (page - 1) * perPage;
    
    const users = await this.prismaService.user.findMany({
      where: whereClause,
      take: perPage,
      skip: skip,
    });

    const total = await this.prismaService.user.count({
      where: whereClause,
    })

    return {
      data: users.map((user) => this.mapToUserResponse(user)),
      paging: {
        current_page: page,
        per_page: perPage,
        total_page: Math.ceil(total / perPage),
        total: total,
      },
    }
  }

  private mapToUserResponse(user: User): UserResponse {
    return {
      email: user.email,
      name: user.name,
      username: user.username,
      created_at: user.createdAt,
      updated_at: user.updatedAt,
    };
  }
}
