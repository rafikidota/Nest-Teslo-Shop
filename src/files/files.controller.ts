import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers/index.helper';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@ApiTags('Files')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService) { }

  @ApiResponse({ status: 201, description: 'File was uploaded successfully'})
  @Post('product')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: fileFilter,
      storage: diskStorage({
        destination: './static/products',
        filename: fileNamer
      })
    }))
    uploadFile(
      @UploadedFile() file: Express.Multer.File
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }
    const secureURL = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    return { secureURL };
  }
  
  @ApiResponse({ status: 200, description: 'File by image name'})
  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    res.sendFile(path);
  }

}
