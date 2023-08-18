import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  login_id: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ unique: true })
  phone_number: string;

  @Column()
  address: string;

  @Column({ default: 3000 })
  point: number;

  @Column({ default: false })
  seller_flag: boolean;
}
