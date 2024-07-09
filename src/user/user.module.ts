import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { constants } from '../common/constants';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserController } from './user.controller';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: constants.JWT_SECRET,
      signOptions: { expiresIn: constants.JWT_EXPIRE },
    }),
  ],
  providers: [
    UserService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
