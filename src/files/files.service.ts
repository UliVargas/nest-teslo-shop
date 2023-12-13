import { createReadStream, existsSync, promises as fs } from 'fs';
import { join } from 'path';

import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';


@Injectable()
export class FilesService {

    constructor(
        @InjectRepository(File)
        private readonly fileRepository: Repository<File>
    ) { }

    getStaticProductImageBuffer(imageName: string) {
        const path = join(__dirname, '../../static/products', imageName);
        if (!existsSync(path))
            throw new BadRequestException(`No product found with image ${imageName}`);
        return fs.readFile(path);
    }

    getStaticProductImageStream(imageName: string) {
        const path = join(__dirname, '../../static/products', imageName);
        if (!existsSync(path))
            throw new BadRequestException(`No product found with image ${imageName}`);
        return createReadStream(path);
    }

    async saveImage(payload: { filename: string, type: string }) {
        const file = this.fileRepository.create(payload)
        return await this.fileRepository.save(file)
    }

    async getFileInfo(filename: string) {
        return this.fileRepository.findOneBy({ filename })
    }

}
