import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692772067509 implements MigrationInterface {
    name = 'Migration1692772067509'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_c14236effb045246dd537171aa1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_c14236effb045246dd537171aa1\` FOREIGN KEY (\`order\`) REFERENCES \`order_details\`(\`order_detail_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_c14236effb045246dd537171aa1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_c14236effb045246dd537171aa1\` FOREIGN KEY (\`order\`) REFERENCES \`orderDetails\`(\`order_detail_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
