import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692670518147 implements MigrationInterface {
    name = 'Migration1692670518147'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP COLUMN \`create_at\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP COLUMN \`update_at\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD \`created_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD \`updated_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP COLUMN \`updated_at\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP COLUMN \`created_at\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD \`update_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD \`create_at\` timestamp(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)`);
    }

}
