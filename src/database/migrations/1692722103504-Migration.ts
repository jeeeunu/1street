import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692722103504 implements MigrationInterface {
    name = 'Migration1692722103504'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review_image\` ADD \`review_id\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`review_image\` DROP COLUMN \`review_id\``);
    }

}
