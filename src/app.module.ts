import { Module } from '@nestjs/common';
import { CommonModule } from './common/common.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { TaskModule } from './task/task.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [CommonModule, AuthModule, UserModule, TaskModule, CommentModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
