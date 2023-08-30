import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from 'src/products/entities/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategorysService {
  constructor(
    @InjectRepository(CategoryEntity)
    private categoryEntity: Repository<CategoryEntity>,
  ) {}

  //-- 전체 카테고리 반환 --//
  async findAll(): Promise<CategoryEntity[]> {
    const categorys = await this.categoryEntity.find({});
    return categorys;
  }
}
