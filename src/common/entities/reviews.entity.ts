import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { UsersEntity } from '.';
import { ReviewImageEntity } from 'src/uploads/entities/review-image.entity';
import { OrderDetailsEntity } from 'src/orders/entities/order-detail.entity';

@Entity({ name: 'reviews' })
export class ReviewsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  public order_detail_id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  public review_rating: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public review_content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: string;

  @ManyToOne(() => UsersEntity, (user) => user.review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  public user: UsersEntity;

  @OneToMany(() => ReviewImageEntity, (review_image) => review_image.review)
  public review_image: ReviewImageEntity[];

  @OneToOne(() => OrderDetailsEntity, (order_detail) => order_detail.review, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'order_detail_id', referencedColumnName: 'id' })
  public order_detail: OrderDetailsEntity;
}
