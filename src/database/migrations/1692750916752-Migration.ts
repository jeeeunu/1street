import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692750916752 implements MigrationInterface {
    name = 'Migration1692750916752'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`likes\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`likes\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`likes\` ADD \`created_at\` datetime(0) NOT NULL`);
    }

}
