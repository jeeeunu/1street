import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692326398307 implements MigrationInterface {
  name = 'Migration1692326398307';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`login_id\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`point\` int NOT NULL DEFAULT '3000', \`seller_flag\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_e564194a9a22f8c623354284f7\` (\`login_id\`), UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e564194a9a22f8c623354284f7\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
