import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { Request } from 'express';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { GoogleRecaptchaGuard } from '@nestlab/google-recaptcha';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) { }

  @UseGuards(JwtAuthGuard, GoogleRecaptchaGuard)
  @Post('create')
  create(@Req() req: Request, @Body() createPostDto: CreatePostDto) {

    return this.postsService.create(req, createPostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('all')
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('update/:id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(+id, updatePostDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('joinPostRoom/:postId')
  async joinPostRoom(@Req() req: Request, @Param('postId') postId: number): Promise<void> {
    await this.postsService.joinPostRoom(req, postId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('leavePostRoom/:postId')
  async leavePostRoom(@Req() req: Request, @Param('postId') postId: number): Promise<void> {
    await this.postsService.leavePostRoom(req, postId);
  }
}
