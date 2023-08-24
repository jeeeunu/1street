import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

@Entity({ name: 'reviews' })
export class ReviewsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  @IsNotEmpty()
  @IsString()
  public user_id: number;

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
}
