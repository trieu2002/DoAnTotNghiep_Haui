import { Controller, Get, Post, Body, Patch, Param, Delete, Response, UseInterceptors, UploadedFile, HttpStatus, ParseFilePipeBuilder } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FILES_ROUTE } from 'src/const/const';
import { Public, ResponseMessage } from 'src/core/core';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller(FILES_ROUTE)
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Public()
  @ResponseMessage('Upload single file')
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile(
    new ParseFilePipeBuilder()
    .addFileTypeValidator({
      fileType: /^(jpg|jpeg|png|image\/png|gif|txt|pdf|doc|text\/plain)$/,
    })
    .addMaxSizeValidator({
      maxSize: 1024*1000 // kb=1MB
    })
    .build({
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY
    }),
  ) file: Express.Multer.File) {
    console.log(file);
      return {
          fileName:file?.filename
      }
  } 

  @Get()
  findAll() {
    return this.filesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.filesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
    return this.filesService.update(+id, updateFileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.filesService.remove(+id);
  }
}
