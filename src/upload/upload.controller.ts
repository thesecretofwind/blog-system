import {
  Body,
  Controller,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { UploadService } from './upload.service';
import { Response } from 'express';

@Controller('upload')
export class UploadController {
  constructor(private uploadService: UploadService) {}
  @Post('upload_file_chunk')
  @UseInterceptors(FileInterceptor('chunk'))
  uplodeFileChunk(
    @UploadedFile() file: Express.Multer.File,
    @Body() formData: any,
    @Res() res: Response,
  ) {
    // console.log(file, formData);
    return this.uploadService.upload(res, file, formData);
  }

  @Post('upload_chunk_end')
  merge(@Body() mergeDto: any) {
    return this.uploadService.merge(mergeDto);
  }
}
