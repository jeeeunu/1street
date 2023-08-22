import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692704087580 implements MigrationInterface {
    name = 'Migration1692704087580'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_3ff3367344edec5de2355a562ee\` ON \`order_details\``);
        await queryRunner.query(`CREATE TABLE \`review_image\` (\`id\` int NOT NULL AUTO_INCREMENT, \`e_tag\` varchar(255) NOT NULL, \`original_name\` varchar(255) NOT NULL, \`encoding\` varchar(255) NOT NULL, \`mime_type\` varchar(255) NOT NULL, \`size\` decimal(10,2) NOT NULL, \`url\` varchar(255) NOT NULL COMMENT 's3 업로드된 localtion url', \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`order_details\` CHANGE \`order_id\` \`order_id\` int NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`order_details\` CHANGE \`order_id\` \`order_id\` int NULL`);
        await queryRunner.query(`DROP TABLE \`review_image\``);
        await queryRunner.query(`CREATE INDEX \`FK_3ff3367344edec5de2355a562ee\` ON \`order_details\` (\`order_id\`)`);
    }

}
