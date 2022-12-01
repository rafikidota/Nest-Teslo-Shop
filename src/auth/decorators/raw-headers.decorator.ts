import { createParamDecorator, InternalServerErrorException } from "@nestjs/common";

export const RawHeaders = createParamDecorator(
    (data: string, ctx) => {
        const req = ctx.switchToHttp().getRequest();
        const rawHeaders = req.rawHeaders;
        if (!rawHeaders) {
            throw new InternalServerErrorException(`rawHeaders not found (request)`);
        }
        return rawHeaders;
    }
);