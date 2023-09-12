import { IsNumber } from 'class-validator';
import { ShopsEntity } from 'src/common/entities';
import { QnasEntity } from 'src/common/entities/qnas.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('qna_answer')
export class QnaAnswerEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column('varchar', { length: 1000 })
  public answer_content: string;

  @Column({ nullable: false })
  @IsNumber()
  public qna_id: number;

  @Column({ nullable: false })
  @IsNumber()
  public shop_id: number;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @ManyToOne(() => QnasEntity, (qna) => qna.qna_answer)
  public qna: QnasEntity;

  @ManyToOne(() => ShopsEntity, (shop) => shop.qna_answer)
  public shop: ShopsEntity;
}
