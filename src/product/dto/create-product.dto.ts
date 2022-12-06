import { IsArray, IsIn, IsInt, IsNumber, IsOptional, IsPositive, IsString, MinLength } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {

    @ApiProperty({
        description: 'Product title (unique)',
        example: 'T-Shirt Teslo',
        nullable: false,
        minLength: 1,
        uniqueItems: true
    })
    @IsString()
    @MinLength(1)
    title: string;

    @ApiProperty({
        description: 'Product price',
        example: 9.99,
    })
    @IsNumber()
    @IsPositive()
    @IsOptional()
    price?: number;

    @ApiProperty({
        description: 'Product description',
        example: 'Sint culpa fugiat sit veniam esse qui. Proident qui Lorem aliquip nostrud est sit dolor ipsum laborum. Amet excepteur quis reprehenderit fugiat in.'
    })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Product slug',
        example: 't_shirt_teslo'
    })
    @IsString()
    @IsOptional()
    slug?: string;

    @ApiProperty({
        description: 'Product stock',
        default: 0,
        example: 1
    })
    @IsNumber()
    @IsInt()
    @IsPositive()
    @IsOptional()
    stock?: number;

    @ApiProperty({
        description: 'Product sizes',
        example: ['M', 'XL', 'XXL']
    })
    @IsString({ each: true })
    @IsArray()
    sizes: string[];

    @ApiProperty({
        description: 'Product gender',
        example: 'women'
    })
    @IsIn(['men', 'women', 'kid', 'unisex'])
    gender: string;

    @ApiProperty({
        description: 'Product tags',
        example: ['teslo', 'teslo_shop'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    tags: string[];

    @ApiProperty({
        description: 'Product images',
        example: ['1740250-00-A_0_2000.jpg', '1740250-00-A_1.jpg'],
    })
    @IsString({ each: true })
    @IsArray()
    @IsOptional()
    images?: string[];
}
