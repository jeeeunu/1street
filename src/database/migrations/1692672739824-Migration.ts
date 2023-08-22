import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692672739824 implements MigrationInterface {
    name = 'Migration1692672739824'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categorys\` ADD \`category_number\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`categorys\` DROP COLUMN \`category_number\``);
    }

}
