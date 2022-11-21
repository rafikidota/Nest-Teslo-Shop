import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductService {

  private readonly logger = new Logger('ProductService');

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource
  ) { }

  async create(createProductDto: CreateProductDto) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image }))
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.handleExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });
    return products.map(product => ({
      ...product,
      images: product.images.map(img => img.url)
    }));
  }

  async findOne(query: string) {
    let product: Product;
    if (isUUID(query)) {
      product = await this.productRepository.findOneBy({ id: query });
    } else {
      // product = await this.productRepository.findOneBy({ slug: query });
      const queryBuilder = this.productRepository.createQueryBuilder('prod');
      product = await queryBuilder.where('UPPER(title) =:title or slug =:slug', {
        title: query.toUpperCase(),
        slug: query
      })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }
    if (!product) {
      throw new NotFoundException(`Product with "${query}" not found`);
    }
    return product;
  }

  async findOnePlain(query: string) {
    const { images = [], ...rest } = await this.findOne(query);
    return {
      ...rest,
      images: images.map(image => image.url)
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const { images, ...toUpdate } = updateProductDto;
    const product = await this.productRepository.preload({ id, ...toUpdate });
    if (!product) {
      throw new NotFoundException(`Product with id: ${id} not found`)
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductImage, { product: { id } });
        product.images = images.map(
          image => this.productImageRepository.create({ url: image })
        );
      }
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleExceptions(error);
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  private handleExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(error);
    throw new InternalServerErrorException(`Unexpected error, check server logs`)
  }
}
