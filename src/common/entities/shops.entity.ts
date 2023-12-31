import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsNumber, IsString, MaxLength } from 'class-validator';
import { ProductsEntity } from './products.entity';
import { UsersEntity } from '.';
import { QnasEntity } from './qnas.entity';
import { QnaAnswerEntity } from 'src/qnas/entities/qna-answer.entity';

@Entity({ name: 'shops' })
export class ShopsEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  //-- 스토어 이름 --//
  @Column({ nullable: false })
  @IsString()
  @MaxLength(30)
  public shop_name: string;

  //-- 스토어 설명 --//
  @Column({ nullable: false })
  @IsString()
  public shop_desc: string;

  //-- 유저 아이디 --//
  @Column({ nullable: false })
  @IsNumber()
  public user_id: number;

  @OneToOne(() => UsersEntity, (user) => user.shop, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  public user: UsersEntity;

  @OneToMany(() => ProductsEntity, (product) => product.shop)
  public products: ProductsEntity[];

  @OneToMany(() => QnasEntity, (qna) => qna.shop)
  public qna: QnasEntity;

  @OneToMany(() => QnaAnswerEntity, (qna_answer) => qna_answer.shop)
  public qna_answer: QnaAnswerEntity;
}
