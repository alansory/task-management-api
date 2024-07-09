import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Request
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Patch('/current')
  async update(
    @Request() req,
    @Body() request: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(req.user, request);
    return {
      data: result,
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async list(
    @Request() req,
  ): Promise<WebResponse<UserResponse[]>> {
    const result = await this.userService.list(req);
    return result
  }
}
