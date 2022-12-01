import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { CommonModule } from '../common/common.module';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product, ProductImage } from './entities';


@Module({
  controllers: [ProductController],
  providers: [ProductService],
  imports: [
    TypeOrmModule.forFeature([Product, ProductImage]),
    CommonModule,
    AuthModule
  ],
  exports: [
    ProductService,
    TypeOrmModule]
})
export class ProductModule { }
