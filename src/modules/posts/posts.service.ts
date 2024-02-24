import { HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { CustomResponse, ResponseDto } from '../../middlewares/responseMiddleware';
import { Post } from './entities/post.entity';
import { CustomLogger } from '../../middlewares/loggerMiddleware';
import { UpdatePostDto } from './dto/update-post.dto';


@Injectable()
export class PostsService {
  private readonly customLogger: CustomLogger;

  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    private readonly customResponse: CustomResponse,

  ) {
    this.customLogger = new CustomLogger(PostsService.name);
  }

  async create(req: Request, postDto: CreatePostDto): Promise<ResponseDto<Post>> {
    try {
      const newPost = new Post();
      newPost.user = req.user['userId'];
      newPost.homePage = postDto.homePage;
      newPost.imgUrl = postDto.imgUrl;
      newPost.text = postDto.text;
      const savedPost = await this.postRepository.save(newPost);

      return await this.customResponse.generateResponse(
        HttpStatus.CREATED,
        savedPost,
        'created'
      );
    } catch (error) {
      this.customLogger.error(this.create.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll(): Promise<ResponseDto<Post[]>> {
    try {
      const posts = await this.postRepository.find({
        relations: ['user'],
        select: {
          user: {
            id: true,
            username: true,
          },
        },
      });

      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        posts,
        'success'
      );
    } catch (error) {
      this.customLogger.error(this.findAll.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async findOne(id: number): Promise<ResponseDto<Post>> {
    try {
      const post = await this.postRepository.findOne(
        {
          where: { id },
          relations: ['user'],
          select: {
            user: {
              id: true,
              username: true,
            },
          },
        }
      );
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        post,
        'success'
      );
    } catch (error) {
      this.customLogger.error(this.findOne.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async update(id: number, updatePostDto: UpdatePostDto): Promise<ResponseDto<Post>> {
    try {
      const post = await this.postRepository.findOne({ where: { id } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }

      post.homePage = updatePostDto.homePage;
      post.imgUrl = updatePostDto.imgUrl;
      post.text = updatePostDto.text;
      const updatedPost = await this.postRepository.save(post);

      return await this.customResponse.generateResponse(
        HttpStatus.OK,
        updatedPost,
        'updated'
      );
    } catch (error) {
      this.customLogger.error(this.update.name, error.message);
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: number): Promise<ResponseDto<void>> {
    try {
      const post = await this.postRepository.findOne({ where: { id } });
      if (!post) {
        throw new NotFoundException(`Post with ID ${id} not found`);
      }
      await this.postRepository.softDelete(id);
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
