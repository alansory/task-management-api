import { Inject, Injectable } from '@nestjs/common';
import { ValidationService } from '../common/validation.service';
import { Logger } from 'winston';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { PrismaService } from '../common/prisma.service';
import { TaskValidation } from './task.validation';
import { Task, User } from '@prisma/client';
import { WebResponse } from '../model/web.model';
import { TaskRequest } from 'src/model/task.model';
import { TaskResponse } from 'src/model/task.model';
import { TaskStatus } from '@prisma/client';


type TaskWithUser = Task & {
  user: User;
};

@Injectable()
export class TaskService {
  constructor(
    private validationService: ValidationService,
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private prismaService: PrismaService,
  ) {}

  async list(params: TaskRequest): Promise<WebResponse<TaskResponse[]>> {
    this.logger.debug(`TaskService.list(${JSON.stringify(params)})`);
    const whereClause: any = {};

    if (params?.id) {
      whereClause.id = params.id;
    }

    if (params?.title) {
      whereClause.title = {
        contains: params.title
      };
    }

    if (params?.description) {
      whereClause.description = params.description;
    }

    if (params?.status) {
      whereClause.status = params.status;
    }

    if (params?.due_date) {
      whereClause.due_date = params.due_date;
    }

    const page = params.page ? Number(params.page) : 1;
    const perPage = params.per_page ? Number(params.per_page) : 10;
    const skip = (page - 1) * perPage;
    
    const tasks = await this.prismaService.task.findMany({
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

    const total = await this.prismaService.task.count({
      where: whereClause,
    })
    
    const result = tasks.map((task) => this.mapToTaskResponse(task))
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

  async get(taskId: number): Promise<WebResponse<TaskResponse>> {
    this.logger.debug(`TaskService.get(${JSON.stringify(taskId)})`);
    const task = await this.prismaService.task.findFirst({
      where: {
        id: taskId,
      },
      include: {
        user: true
      }
    });
    return this.mapToTaskResponse(task)
  }

  async create(user: User, request: TaskRequest): Promise<WebResponse<TaskResponse>> {
    this.logger.debug(
      `TaskService.create( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );
    const createRequest: TaskRequest =
      this.validationService.validate(TaskValidation.CREATE, request);

    const assigneeId = request.assignee_id ? Number(request.assignee_id) : null;
    const taskCreateInput = {
      title: createRequest.title,
      description: request.description || null,
      due_date: request.due_date ? new Date(request.due_date).toISOString() : null,
      status: request.status ? (Object.values(TaskStatus).includes(request.status as TaskStatus) ? request.status : TaskStatus.TO_DO) : TaskStatus.TO_DO,
      creator: {
        connect: {
          id: user.id,
        },
      },
      user: assigneeId ? {
        connect: {
          id: assigneeId,
        },
      } : undefined
    };

    const task = await this.prismaService.task.create({
      data: taskCreateInput,
      include: {
        user: true
      }
    });
    return this.mapToTaskResponse(task)
  }

  async update(taskId: number, user: User, request: TaskRequest): Promise<WebResponse<TaskResponse>> {
    this.logger.debug(
      `TaskService.update( ${JSON.stringify(user)} , ${JSON.stringify(request)} )`,
    );
    const createRequest: TaskRequest =
      this.validationService.validate(TaskValidation.CREATE, request);

    const assigneeId = request.assignee_id ? Number(request.assignee_id) : null;
    const taskCreateInput = {
      title: createRequest.title,
      description: request.description || null,
      due_date: request.due_date ? new Date(request.due_date).toISOString() : null,
      status: request.status ? (Object.values(TaskStatus).includes(request.status as TaskStatus) ? request.status : TaskStatus.TO_DO) : TaskStatus.TO_DO,
      user: assigneeId ? {
        connect: {
          id: assigneeId,
        },
      } : undefined,
    };

    const task = await this.prismaService.task.update({
      where: {
        id: taskId,
      },
      data: taskCreateInput,
      include: {
        user: true
      }
    });
    return this.mapToTaskResponse(task)
  }

  async delete(taskId: number): Promise<WebResponse<TaskResponse>>  {
    this.logger.debug(
      `TaskService.delete( ${JSON.stringify(taskId)} )`,
    );

    const task = await this.prismaService.task.findUnique({
      where: {
        id: taskId,
      },
      include: {
        user: true
      }
    });
    
    await this.prismaService.$transaction([
      this.prismaService.comment.deleteMany({
        where: {
          task_id: taskId,
        },
      }),

      this.prismaService.task.delete({
        where: {
          id: taskId,
        }
      }),
    ]);

    return this.mapToTaskResponse(task)
  }

  private mapToTaskResponse(task: TaskWithUser) {
    return {
      data : {
        id: task.id,         
        title: task.title,      
        description: task.description,
        creator_id: task.creator_id,  
        assignee_id: task.assignee_id,
        status: task.status,     
        due_date: task.due_date,     
        created_at: task.created_at,  
        updated_at: task.updated_at,
        user: task.user ? {
          id: task.user.id,
          name: task.user.name,
          email: task.user.email,
        } : null,
      },
      message: "OK",
      status_code: 200  
    };
  }
}
