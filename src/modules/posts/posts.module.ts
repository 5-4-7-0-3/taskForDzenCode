import { JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { CustomLogger } from '../../middlewares/loggerMiddleware';
import { CustomResponse } from '../../middlewares/responseMiddleware';
import { Post } from './entities/post.entity';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    PassportModule,
  ],
  controllers: [
    PostsController
  ],
  providers: [
    PostsService,
    CustomLogger,
    CustomResponse,
    JwtService,
    JwtStrategy
  ],
})
export class PostsModule { }
