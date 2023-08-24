import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692839380343 implements MigrationInterface {
  name = 'Migration1692839380343';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9a5f6868c96e0069e699f33e124\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_9e952e93f369f16e27dd786c33f\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` DROP FOREIGN KEY \`FK_bb9c758dcc60137e56f6fee72f7\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_35eb9e9cc6f706f1a9af2f9d158\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_3f519ed95f775c781a254089171\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`user_id\` \`userId\` int NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE \`qnas\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`qna_name\` varchar(50) NOT NULL, \`qna_content\` varchar(1000) NOT NULL, \`status\` varchar(255) NOT NULL, \`results\` text array NOT NULL, \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`shop_id\``);
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP COLUMN \`category_id\``,
    );
    await queryRunner.query(`ALTER TABLE \`likes\` DROP COLUMN \`user_id\``);
    await queryRunner.query(`ALTER TABLE \`likes\` DROP COLUMN \`product_id\``);
    await queryRunner.query(`ALTER TABLE \`products\` ADD \`shopId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`categoryId\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`likes\` ADD \`userId\` int NULL`);
    await queryRunner.query(`ALTER TABLE \`likes\` ADD \`productId\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`qnas\` ADD CONSTRAINT \`FK_f95969cb9228b3e48f0973b0e64\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_51a281693ebef6fa8729de39381\` FOREIGN KEY (\`shopId\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_ff56834e735fa78a15d0cf21926\` FOREIGN KEY (\`categoryId\`) REFERENCES \`categorys\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`FK_48152549b90b2c8817139aa375b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_cfd8e81fac09d7339a32e57d904\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_36096625e9a713d7b1f8d34eea0\` FOREIGN KEY (\`productId\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_36096625e9a713d7b1f8d34eea0\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` DROP FOREIGN KEY \`FK_cfd8e81fac09d7339a32e57d904\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` DROP FOREIGN KEY \`FK_48152549b90b2c8817139aa375b\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_ff56834e735fa78a15d0cf21926\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_51a281693ebef6fa8729de39381\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`qnas\` DROP FOREIGN KEY \`FK_f95969cb9228b3e48f0973b0e64\``,
    );
    await queryRunner.query(`ALTER TABLE \`likes\` DROP COLUMN \`productId\``);
    await queryRunner.query(`ALTER TABLE \`likes\` DROP COLUMN \`userId\``);
    await queryRunner.query(
      `ALTER TABLE \`products\` DROP COLUMN \`categoryId\``,
    );
    await queryRunner.query(`ALTER TABLE \`products\` DROP COLUMN \`shopId\``);
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD \`product_id\` int NULL`,
    );
    await queryRunner.query(`ALTER TABLE \`likes\` ADD \`user_id\` int NULL`);
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`category_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD \`shop_id\` int NULL`,
    );
    await queryRunner.query(`DROP TABLE \`qnas\``);
    await queryRunner.query(
      `ALTER TABLE \`shops\` CHANGE \`userId\` \`user_id\` int NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_3f519ed95f775c781a254089171\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`likes\` ADD CONSTRAINT \`FK_35eb9e9cc6f706f1a9af2f9d158\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`shops\` ADD CONSTRAINT \`FK_bb9c758dcc60137e56f6fee72f7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9e952e93f369f16e27dd786c33f\` FOREIGN KEY (\`shop_id\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE \`products\` ADD CONSTRAINT \`FK_9a5f6868c96e0069e699f33e124\` FOREIGN KEY (\`category_id\`) REFERENCES \`categorys\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
