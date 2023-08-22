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
  id: string;

  @Column()
  review_id: number;

  @Column()
  e_tag: string;

  @Column()
  original_name: string;

  @Column()
  encoding: string;

  @Column()
  mime_type: string;

  @Column('decimal', { precision: 10, scale: 2 })
  size: number;

  @Column({ comment: 's3 업로드된 localtion url' })
  url: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
