import { UsersEntity } from 'src/common/entities/users.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProductsEntity } from './products.entity';
import { QnaAnswerEntity } from 'src/qnas/entities/qna-answer.entity';

@Entity({ name: 'qnas' })
export class QnasEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  // @Column()
  // @IsNotEmpty()
  // @IsString()
  // public product_id: number;

  // qna 제목
  @Column('varchar', { length: 50 })
  public qna_name: string;

  // qna 내용
  @Column('varchar', { length: 1000 })
  public qna_content: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: string;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: string;

  @ManyToOne(() => UsersEntity, (user) => user.qna)
  public user: UsersEntity;

  @ManyToOne(() => ProductsEntity, (product) => product.qna)
  public product: ProductsEntity;

  @OneToMany(() => QnaAnswerEntity, (qna_answer) => qna_answer.qna)
  public qna_answer: QnaAnswerEntity;
}
