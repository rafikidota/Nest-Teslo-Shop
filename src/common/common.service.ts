import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
    handleExceptions(error: any, service: string): never {
        const logger = new Logger(service);
        if (error.code === '23505') {
            throw new BadRequestException(error.detail);
        }
        logger.error(error);
        throw new InternalServerErrorException(`Unexpected error, check server logs`)
    }
}
