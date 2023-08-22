import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692615066526 implements MigrationInterface {
    name = 'Migration1692615066526'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`products\` (\`id\` int NOT NULL AUTO_INCREMENT, \`product_name\` varchar(255) NOT NULL, \`product_desc\` varchar(255) NOT NULL, \`product_price\` int NOT NULL, \`product_thumbnail\` varchar(255) NULL, \`shopId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`products\` ADD CONSTRAINT \`FK_51a281693ebef6fa8729de39381\` FOREIGN KEY (\`shopId\`) REFERENCES \`shops\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`products\` DROP FOREIGN KEY \`FK_51a281693ebef6fa8729de39381\``);
        await queryRunner.query(`DROP TABLE \`products\``);
    }

}
