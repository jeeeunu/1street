import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692590454328 implements MigrationInterface {
  name = 'Migration1692590454328';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`shops\` (\`id\` int NOT NULL AUTO_INCREMENT, \`shop_name\` varchar(255) NOT NULL, \`shop_desc\` varchar(255) NOT NULL, \`shop_image\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`shops\``);
  }
}
