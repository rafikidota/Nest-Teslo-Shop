import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SeedService } from './seed.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Seed')
@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) { }

  @ApiResponse({ status: 201, description: 'Seed was executed successfully' })
  @Get()
  findAll() {
    return this.seedService.runSeed();
  }

}
