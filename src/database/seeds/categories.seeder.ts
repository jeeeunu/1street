import { CategoryEntity } from 'src/products/entities/category.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class categoriesSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(CategoryEntity);
    const categories = [
      {
        id: 1,
        category_name: '의류',
        category_number: 1,
      },
      {
        id: 2,
        category_name: '뷰티',
        category_number: 2,
      },
      {
        id: 3,
        category_name: '유아동',
        category_number: 3,
      },
      {
        id: 4,
        category_name: '식품',
        category_number: 4,
      },
      {
        id: 5,
        category_name: '주방용품',
        category_number: 5,
      },
      {
        id: 6,
        category_name: '생활용품',
        category_number: 6,
      },
      {
        id: 7,
        category_name: '인테리어',
        category_number: 7,
      },
      {
        id: 8,
        category_name: '가전 디지털',
        category_number: 8,
      },
      {
        id: 9,
        category_name: '스포츠/레저',
        category_number: 9,
      },
      {
        id: 10,
        category_name: '자동차 용품',
        category_number: 10,
      },
      {
        id: 11,
        category_name: '도서/음반/DVD',
        category_number: 11,
      },
      {
        id: 12,
        category_name: '완구/취미',
        category_number: 12,
      },
    ];
    await repository.insert(categories);
  }
}
