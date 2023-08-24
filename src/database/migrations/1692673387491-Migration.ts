import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692673387491 implements MigrationInterface {
    name = 'Migration1692673387491'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_86ff9a3d241d36dc67d594c63a6\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`orderIdOrderDetailId\` \`order\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_c14236effb045246dd537171aa1\` FOREIGN KEY (\`order\`) REFERENCES \`orderDetails\`(\`order_detail_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_c14236effb045246dd537171aa1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` CHANGE \`order\` \`orderIdOrderDetailId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_86ff9a3d241d36dc67d594c63a6\` FOREIGN KEY (\`orderIdOrderDetailId\`) REFERENCES \`orderDetails\`(\`order_detail_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
