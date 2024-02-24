import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { CustomLogger } from 'src/middlewares/loggerMiddleware';
import { CustomResponse } from 'src/middlewares/responseMiddleware';

@Module({
  controllers: [FilesController],
  providers: [
    CustomLogger,
    CustomResponse
  ],
})
export class FilesModule { }
