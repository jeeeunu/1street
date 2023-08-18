import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUser1692255999587 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //-- 테이블 생성 : users --//
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // 해당 컬럼 자동 생성
            generationStrategy: 'increment', // 컬럼 값 자동증가
          },
          {
            name: 'login_id',
            type: 'varchar',
            length: '20',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '20',
          },
          {
            name: 'email',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'phone_number',
            type: 'varchar',
            length: '40',
            isUnique: true,
          },
          {
            name: 'address',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'point',
            type: 'int',
            default: 3000,
          },
          {
            name: 'seller_flag',
            type: 'boolean',
            default: false,
          },
        ],
      }),
    );

    //-- 테이블 생성 : shop --//
    await queryRunner.createTable(
      new Table({
        name: 'shops',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true, // 해당 컬럼 자동 생성
            generationStrategy: 'increment', // 컬럼 값 자동증가
          },
          {
            name: 'user_id',
            type: 'int',
            isNullable: true, // user가 탈퇴해도 shop의 정보 남아있음
          },
          {
            name: 'shop_desc',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'shop_image',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
        ],
      }),
    );

    //-- 외래키 생성 : shop-user --//
    await queryRunner.createForeignKey(
      'shops',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 제약 조건 제거
    try {
      await queryRunner.dropForeignKey('shops', 'user_id');
    } catch (error) {
      console.error(error);
    }
    await queryRunner.dropTable('shops'); // 롤백 : shop 테이블
    await queryRunner.dropTable('users'); // 롤백 : user 테이블
  }
}
