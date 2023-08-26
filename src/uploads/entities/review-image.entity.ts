import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('review_image')
export class ReviewImageEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  review_id: number;

  @Column({ comment: 's3 업로드된 localtion url' })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
