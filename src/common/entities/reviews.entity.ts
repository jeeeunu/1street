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
  public review_rating: number;

  @Column()
  @IsOptional()
  @IsString()
  public review_content: string;

  @CreateDateColumn({ type: 'timestamp' })
  create_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  update_at: Date;
}
