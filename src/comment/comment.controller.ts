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
import { CommentService } from './comment.service';
import { WebResponse } from '../model/web.model';
import { CommentRequest, CommentResponse } from '../model/comment.model';

@Controller('/comments')
export class CommentController {
  constructor(private commentService: CommentService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  async list(
    @Query() param: CommentRequest,
  ): Promise<WebResponse<CommentResponse[]>> {
    const result = await this.commentService.list(param);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Get('/:commentId')
  async detail(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<WebResponse<CommentResponse>> {
    const result = await this.commentService.get(commentId);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(
    @Request() req,
    @Body() body: CommentRequest,
  ): Promise<WebResponse<CommentResponse>> {
    const user = req.user
    const result = await this.commentService.create(user, body);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Put('/:commentId')
  async update(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Request() req,
    @Body() body: CommentRequest,
  ): Promise<WebResponse<CommentResponse>> {
    const user = req.user
    const result = await this.commentService.update(commentId, user, body);
    return result
  }

  @HttpCode(HttpStatus.OK)
  @Delete('/:commentId')
  async delete(
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<WebResponse<CommentResponse>> {
    const result = await this.commentService.delete(commentId);
    return result
  }  
}
