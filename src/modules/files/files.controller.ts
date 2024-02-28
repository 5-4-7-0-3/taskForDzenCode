import { Controller, Post, UseInterceptors, UploadedFile, HttpStatus, ParseFilePipe, Param, Res, Get, NotFoundException, InternalServerErrorException, UseGuards } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { fileExists, processFile, saveFile } from 'src/middlewares/utilsUploadFiles';
import { CustomResponse, ResponseDto } from '../../middlewares/responseMiddleware';
import { CustomLogger } from 'src/middlewares/loggerMiddleware';
import { createReadStream } from 'fs';
import { join } from 'path';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('files')
export class FilesController {
  private readonly customLogger: CustomLogger;
  constructor(
    private readonly customResponse: CustomResponse,
  ) {
    this.customLogger = new CustomLogger(FilesController.name);
  }
  
  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
    }),
  )
  async uploadedFile(@UploadedFile(new ParseFilePipe()) file: Express.Multer.File) {
    try {
      const processedFile = await processFile(file);
      const response = {
        originalname: processedFile.originalname,
        filename: processedFile.filename,
      };

      const x = await saveFile(processedFile);
      return this.customResponse.generateResponse(
        HttpStatus.OK,
        response,
        'File successfully uploaded and saved!',
      );
    } catch (error) {
      throw new InternalServerErrorException('Error while processing file');
    }
  }


  @UseGuards(JwtAuthGuard)
  @Get(':filename')
  async getFile(@Param('filename') filename: string, @Res() res): Promise<void> {
    try {
      const filePath = join(__dirname,'../../..', 'uploads', filename);
      if (!await fileExists(filePath)) {
        throw new NotFoundException('File not found');
      }

      const stream = createReadStream(filePath);
      stream.pipe(res);
    } catch (error) {
      throw new InternalServerErrorException('Error while getting file');
    }
  }
}





