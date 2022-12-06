import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from '../common/dto/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interfaces/valid-roles';
import { User } from '../auth/entities/user.entity';
import { Product } from './entities/product.entity';

@ApiTags('Products')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiResponse({ status: 201, description: 'Product was created successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'User needs a valid role' })
  @Auth(ValidRoles.admin)
  create(
    @Body() createProductDto: CreateProductDto,
    @GetUser() user: User) {
    return this.productService.create(createProductDto, user);
  }

  @ApiResponse({ status: 200, description: 'List of products', type: Product, isArray: true })
  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    return this.productService.findAll(paginationDto);
  }

  @ApiResponse({ status: 200, description: 'Product found by query', type: Product })
  @Get(':query')
  findOne(@Param('query') query: string) {
    return this.productService.findOnePlain(query);
  }

  @ApiResponse({ status: 200, description: 'Product was updated successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'User needs a valid role' })
  @Patch(':id')
  @Auth(ValidRoles.admin)
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: User) {
    return this.productService.update(id, updateProductDto, user);
  }

  @ApiResponse({ status: 201, description: 'Product was deleted  successfully', type: Product })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 403, description: 'User needs a valid role' })
  @Delete(':id')
  @Auth(ValidRoles.admin)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.productService.remove(id);
  }
}

