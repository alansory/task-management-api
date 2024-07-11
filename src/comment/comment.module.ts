import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { CommentService } from './comment.service';
import { constants } from '../common/constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { CommentController } from './comment.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRE },
    }),
  ],
  providers: [
    CommentService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [CommentController],
  exports: [CommentService],
})
export class CommentModule {}
