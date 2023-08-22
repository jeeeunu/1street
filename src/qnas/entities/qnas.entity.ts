import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'qnas' })
export class QnasEntity {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id' })
  id: number;

  // user_id, product_id 도 입력해야 하는가?

  @Column('varchar', { length: 50 })
  name: string;

  @Column('varchar', { length: 1000 })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date | null;
}
