import { ProductsEntity } from 'src/common/entities';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('product_image')
export class ProductImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: 's3 업로드된 localtion url' })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => ProductsEntity, (product) => product.product_image)
  product: ProductsEntity;
}
