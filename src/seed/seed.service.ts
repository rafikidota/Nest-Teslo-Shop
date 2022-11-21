import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { initialData } from './data/seed-data';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductService
  ) { }

  async runSeed() {
    this.insertNewProducts();
    return `Seed executed`;
  }

  private async insertNewProducts() {
    await this.productService.deleteAll();
    const products = initialData.products;
    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.productService.create(product));
    });
    await Promise.all(insertPromises);
    return true;
  }

}
