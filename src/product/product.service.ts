import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product, ProductImage } from './entities';
import { PaginationDto } from '../common/dto/pagination.dto';
import { validate as isUUID } from 'uuid';
import { CommonService } from '../common/common.service';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ProductService {

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,
    private readonly dataSource: DataSource,
    private readonly commonService: CommonService
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    try {
      const { images = [], ...productDetails } = createProductDto;
      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({ url: image })),
        user
      });
      await this.productRepository.save(product);
      return { ...product, images };
    } catch (error) {
      this.commonService.handleExceptions(error, 'ProductService');
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

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {
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
      product.user = user;
      await queryRunner.manager.save(product);
      await queryRunner.commitTransaction();
      await queryRunner.release();
      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.commonService.handleExceptions(error, 'ProductService');
    }

  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return product;
  }

  async deleteAll() {
    const query = this.productRepository.createQueryBuilder('product');
    try {
      return query
        .delete()
        .where({})
        .execute();
    } catch (error) {
      this.commonService.handleExceptions(error, 'ProductService');
    }
  }

}
