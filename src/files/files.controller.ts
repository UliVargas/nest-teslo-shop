import { Controller, Get, Post, Param, UploadedFile, UseInterceptors, BadRequestException, Res, StreamableFile, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

import { Response } from 'express';
import { diskStorage } from 'multer';
import { FilesService } from './files.service';

import { fileFilter, fileNamer } from './helpers';

@ApiTags('Files - Get and Upload')
@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
  ) { }

  @Get('product/buffer/:imageName')

  async findProductImageBuffer(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    try {
      const path = await this.filesService.getStaticProductImageBuffer(imageName);

      // Esto es opcional, pero sería algo bueno para agregar, ya que así nos evita errores a futuro
      // const fileInfo = await this.filesService.getFileInfo(imageName)
      // console.log({ fileInfo });

      // res.setHeader('Content-Type', fileInfo.type);
      // res.setHeader('Content-Disposition', `attachment; filename=${imageName}`);
      res.send(path)
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error)
    }
  }

  @Get('product/stream/:imageName')
  findProductImageStream(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {
    const path = this.filesService.getStaticProductImageStream(imageName);
    path.pipe(res);
  }



  @Post('product')
  @UseInterceptors(FileInterceptor('file', {
    // fileFilter: fileFilter,
    // limits: { fileSize: 1000 }
    storage: diskStorage({
      destination: './static/products',
      filename: fileNamer
    })
  }))
  async uploadProductImage(
    @UploadedFile() file: Express.Multer.File,
  ) {
    if (!file) {
      throw new BadRequestException('Make sure that the file is an image');
    }

    // const secureUrl = `${ file.filename }`;
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    await this.filesService.saveImage({
      filename: file.filename,
      type: file.mimetype
    })

    return { secureUrl };
  }

}
