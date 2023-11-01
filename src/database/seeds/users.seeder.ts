import { UsersEntity } from '../../common/entities/users.entity';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export default class UsersSeeder implements Seeder {
  public async run(dataSource: DataSource): Promise<any> {
    const repository = dataSource.getRepository(UsersEntity);
    const users = [
      {
        email: 'admin@example.com',
        password: '987654321w!',
        name: '관리자',
        phone_number: '010-1234-5678',
        address: '대한민국',
        seller_flag: true,
      },
      {
        email: 'user@example.com',
        password: '987654321w!',
        name: '일반 유저',
        phone_number: '010-5678-1234',
        address: '대한민국',
        seller_flag: false,
      },
    ];
    await repository.insert(users);
  }
}
