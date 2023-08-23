import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsNumber, IsString } from 'class-validator';
import { ProductsEntity } from '../../common/entities/products.entity';

@Entity({ name: 'categorys' })
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //-- 카테고리 이름 --//
  @Column({ nullable: false })
  @IsString()
  public category_name: string;

  //-- 카테고리 번호 --//
  @Column({ nullable: false })
  @IsNumber()
  public category_number: number;

  @OneToMany(() => ProductsEntity, (product) => product.category)
  public products: ProductsEntity[];
}
