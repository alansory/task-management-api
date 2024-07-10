import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TaskService } from './task.service';
import { constants } from '../common/constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { TaskController } from './task.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRE },
    }),
  ],
  providers: [
    TaskService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [TaskController],
  exports: [TaskService],
})
export class TaskModule {}
