import { Injectable } from '@nestjs/common';
import { ProductService } from '../product/product.service';
import { initialData } from './data/seed-data';
import { Auth } from '../auth/decorators/auth.decorator';
import { ValidRoles } from '../auth/interfaces/valid-roles';

@Injectable()
export class SeedService {

  constructor(
    private readonly productService: ProductService
  ) { }
  @Auth(ValidRoles.superUser)
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
