import { Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { CommentValidation } from './comment.validation';
import { Comment, User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import { CommentRequest, CommentResponse } from 'src/model/comment.model';


type CommentWithUser = Comment & {
  user: User;
};
@Injectable()
export class CommentService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async list(params: CommentRequest): Promise<WebResponse<CommentResponse[]>> {
    this.logger.debug(`CommentService.list(${JSON.stringify(params)})`);
    const whereClause: any = {};

    if (params?.id) {
      whereClause.id = params.id;
    }

    if (params?.content) {
      whereClause.content = params.content;
    }

    if (params?.user_id) {
      whereClause.user_id = params.user_id;
    }

    if (params?.task_id) {
      whereClause.task_id = Number(params.task_id);
    }

    const page = params.page ? Number(params.page) : 1;
    const perPage = params.per_page ? Number(params.per_page) : 10;
    const skip = (page - 1) * perPage;
    
    const comments = await this.prismaService.comment.findMany({
      where: whereClause,
      take: perPage,
      skip: skip,
      include: {
        user: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    const total = await this.prismaService.comment.count({
      where: whereClause,
    })
    
    const result = comments.map((comment) => this.mapToCommentResponse(comment))
    return {
      data: result.map((r) => r.data),
      paging: {
        current_page: page,
        per_page: perPage,
        total_page: Math.ceil(total / perPage),
        total: total,
      },
      message: "OK",
      status_code: 200,
    }
  }

  async get(commentId: number): Promise<WebResponse<CommentResponse>> {
    this.logger.debug(`CommentService.get(${JSON.stringify(commentId)})`);
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
      },
      include: {
        user: true
      }
    });
    return this.mapToCommentResponse(comment)
  }

  async create(user: User, request: CommentRequest): Promise<WebResponse<CommentResponse>> {
    this.logger.debug(
      `CommentService.create( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );
    const createRequest: CommentRequest =
      this.validationService.validate(CommentValidation.VALIDATE, request);

    const commentCreateInput = {
      content: createRequest.content,
      user: {
        connect: {
          id: user.id,
        },
      },
      task: {
        connect: {
          id: request.task_id,
        },
      },
    };

    const comment = await this.prismaService.comment.create({
      data: commentCreateInput,
      include: {
        user: true,
      }
    });
    return this.mapToCommentResponse(comment)
  }

  async update(commentId: number, user: User, request: CommentRequest): Promise<WebResponse<CommentResponse>> {
    this.logger.debug(
      `CommentService.update( ${JSON.stringify(commentId)} , ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );
    const createRequest: CommentRequest =
      this.validationService.validate(CommentValidation.VALIDATE, request);

    const  commentCreateInput = {
      content: createRequest.content,
      user: {
        connect: {
          id: user.id,
        },
      },
      task: {
        connect: {
          id: request.task_id,
        },
      },
    };

    const comment = await this.prismaService.comment.update({
      where: {
        id: commentId,
      },
      include: {
        user: true
      },
      data: commentCreateInput,
    });
    return this.mapToCommentResponse(comment)
  }

  async delete(commentId: number): Promise<WebResponse<CommentResponse>>  {
    this.logger.debug(
      `CommentService.delete( ${JSON.stringify(commentId)} )`,
    );
    const comment = await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
      include: {
        user: true
      }
    });

    return this.mapToCommentResponse(comment)
  }

  private mapToCommentResponse(comment: CommentWithUser) {
    return {
      data : {
        id: comment.id,         
        content: comment.content,      
        user_id: comment.user_id,
        task_id: comment.task_id,  
        created_at: comment.created_at,  
        updated_at: comment.updated_at,
        user: {
          id: comment.user.id,
          name: comment.user.name,
          email: comment.user.email,
        },
      },
      message: "OK",
      status_code: 200  
    };
  }
}
