import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Put,
  Query,
  Request,
  Param
} from '@nestjs/common';
import { UserService } from './user.service';
import { WebResponse } from '../model/web.model';
import {
  SearchUserRequest,
  UpdateUserRequest,
  UserResponse,
} from '../model/user.model';

@Controller('/users')
export class UserController {
  constructor(private userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async list(
    @Query() request:SearchUserRequest,
  ): Promise<WebResponse<UserResponse[]>> {
    const result = await this.userService.list(request);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:id')
  async update(
    @Param('id') id: number,
    @Request() request,
    @Body() body: UpdateUserRequest,
  ): Promise<WebResponse<UserResponse>> {
    const result = await this.userService.update(id, request.user, body);
    return result
  }
}
