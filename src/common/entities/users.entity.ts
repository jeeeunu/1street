import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { LikeEntity, OrdersEntity, ShopsEntity } from '.';
import { QnasEntity } from './qnas.entity';

export enum Provider {
  Local,
  Google,
}
@Entity({ name: 'users' })
export class UsersEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  // 로그인 이메일
  @Column({ unique: true })
  public email: string;

  // 비밀번호
  @Exclude({ toPlainOnly: true })
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public password?: string;

  // 프로필 이미지
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public profile_image: string;

  @Column()
  public name: string;

  @Column({ unique: true, nullable: true })
  @IsOptional()
  @IsString()
  public phone_number: string;

  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  public address: string;

  @Column({ default: 3000 })
  public point: number;

  @Column({ default: false })
  public seller_flag: boolean;

  @Column({ default: 'none' })
  public provider: string;

  @OneToMany(() => OrdersEntity, (order) => order.user)
  public orders: OrdersEntity[];

  @OneToMany(() => ShopsEntity, (shop) => shop.user)
  public shops: ShopsEntity[];

  @OneToMany(() => LikeEntity, (like) => like.user)
  public likes: LikeEntity[];

  @OneToMany(() => QnasEntity, (qna) => qna.user)
  public qna: QnasEntity[];
}
