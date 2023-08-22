import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692637975970 implements MigrationInterface {
    name = 'Migration1692637975970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD \`user_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` ADD \`order_detail_id\` int NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`review_content\` \`review_content\` varchar(255) NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`reviews\` CHANGE \`review_content\` \`review_content\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP COLUMN \`order_detail_id\``);
        await queryRunner.query(`ALTER TABLE \`reviews\` DROP COLUMN \`user_id\``);
    }

}
