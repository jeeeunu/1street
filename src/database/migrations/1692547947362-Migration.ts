import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1692547947362 implements MigrationInterface {
  name = 'Migration1692547947362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NULL, \`profile_image\` varchar(255) NULL, \`name\` varchar(255) NOT NULL, \`phone_number\` varchar(255) NULL, \`address\` varchar(255) NULL, \`point\` int NOT NULL DEFAULT '3000', \`seller_flag\` tinyint NOT NULL DEFAULT 0, \`provider\` varchar(255) NOT NULL DEFAULT 'none', UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), UNIQUE INDEX \`IDX_17d1817f241f10a3dbafb169fd\` (\`phone_number\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX \`IDX_17d1817f241f10a3dbafb169fd\` ON \`users\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``,
    );
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
