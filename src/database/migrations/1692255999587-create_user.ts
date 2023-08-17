import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateUser1692255999587 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    //-- 테이블 생성 : user --//
    await queryRunner.createTable(
      new Table({
        name: 'user',
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
            name: 'phomenumber',
            type: 'int',
          },
          {
            name: 'address',
            type: 'varchar',
            length: '100',
          },
          {
            name: 'point',
            type: 'int',
            default: 30000,
          },
        ],
      }),
    );

    //-- 테이블 생성 : shop --//
    await queryRunner.createTable(
      new Table({
        name: 'shop',
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
            isNullable: false,
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
      'shop',
      new TableForeignKey({
        columnNames: ['user_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'user',
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 제약 조건 제거
    await queryRunner.dropForeignKey('shop', 'FK_801741ae213da67afe2f556d207');

    await queryRunner.dropTable('user'); // 롤백 : user 테이블
    await queryRunner.dropTable('shop'); // 롤백 : shop 테이블
  }
}
