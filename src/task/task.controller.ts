import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  Request,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { TaskService } from './task.service';
import { WebResponse } from '../model/web.model';
import { TaskRequest, TaskResponse } from 'src/model/task.model';

@Controller('/tasks')
export class TaskController {
  constructor(private taskService: TaskService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async list(
    @Query() param: TaskRequest,
  ): Promise<WebResponse<TaskResponse[]>> {
    const result = await this.taskService.list(param);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:taskId')
  async detail(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.get(taskId);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(
    @Request() req,
    @Body() body: TaskRequest,
  ): Promise<WebResponse<TaskResponse>> {
    const user = req.user ? req.user.data : null
    const result = await this.taskService.create(user, body);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:taskId')
  async update(
    @Param('taskId', ParseIntPipe) taskId: number,
    @Request() req,
    @Body() body: TaskRequest,
  ): Promise<WebResponse<TaskResponse>> {
    const user = req.user ? req.user.data : null
    const result = await this.taskService.update(taskId, user, body);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:taskId')
  async delete(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<WebResponse<TaskResponse>> {
    const result = await this.taskService.delete(taskId);
    return result
  }  
}
