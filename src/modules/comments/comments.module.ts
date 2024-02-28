import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { CustomLogger } from '../../middlewares/loggerMiddleware';
import { CustomResponse } from '../../middlewares/responseMiddleware';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { Comment } from './entities/comment.entity';
import { SocketService } from '../socket/socket.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([Comment]),
    PassportModule,
  ],
  controllers: [CommentsController],
  providers: [
    CommentsService,
    CustomLogger,
    CustomResponse,
    JwtService,
    JwtStrategy,
    SocketService
  ],
})
export class CommentsModule { }
