import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Request } from 'express';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CustomResponse, ResponseDto } from '../../middlewares/responseMiddleware';
import { CustomLogger } from '../../middlewares/loggerMiddleware';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {

  private readonly customLogger: CustomLogger;

  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    private readonly customResponse: CustomResponse,

  ) {
    this.customLogger = new CustomLogger(CommentsService.name);
  }

  async create(req: Request, commentDto: CreateCommentDto): Promise<ResponseDto<Comment>> {
    try {
      const newComment = new Comment();
      newComment.user = req.user['userId'];;
      newComment.post = commentDto.post;
      newComment.text = commentDto.text;

      const savedComment = await this.commentsRepository.save(newComment);

      return await this.customResponse.generateResponse(
        HttpStatus.CREATED,
        savedComment,
        'created'
      );
    } catch (error) {
      this.customLogger.error(this.create.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<ResponseDto<Comment[]>> {
    try {
      const comments = await this.commentsRepository.find({
        relations: ['user', 'post'],
        select: {
          user: {
            id: true,
            username: true,
          },
          post: {
            id: true,
          },
        },
      });
      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        comments,
        'success'
      );
    } catch (error) {
      this.customLogger.error(this.findAll.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number) {
    try {
      const comment = await this.commentsRepository.findOne({
        where: { id },
        relations: ['user', 'post'],
        select: {
          user: {
            id: true,
            username: true,
          },
          post: {
            id: true,
          },
        },
      });
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        comment,
        'success'
      );
    } catch (error) {
      this.customLogger.error(this.findOne.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updateCommentDto: UpdateCommentDto) {
    try {
      const comment = await this.commentsRepository.findOne({where: {id}});
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      comment.text = updateCommentDto.text;
      const updatedComment = await this.commentsRepository.save(comment);
      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        updatedComment,
        'updated'
      );
    } catch (error) {
      this.customLogger.error(this.update.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number) {
    try {
      const comment = await this.commentsRepository.findOne({ where: { id } });
      if (!comment) {
        throw new NotFoundException(`Comment with ID ${id} not found`);
      }
      await this.commentsRepository.softDelete(id);
      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        null,
        'deleted'
      );
    } catch (error) {
      this.customLogger.error(this.remove.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }
}
