import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692855316367 implements MigrationInterface {
    name = 'Migration1692855316367'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX \`FK_a922b820eeef29ac1c6800e826a\` ON \`orders\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_ce1f689e43b39edd9330cadaeb8\` FOREIGN KEY (\`product_id\`) REFERENCES \`products\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`order_details\` ADD CONSTRAINT \`FK_2cc5c8fdd5d9215dfaf97d2496d\` FOREIGN KEY (\`order_order_id\`) REFERENCES \`orders\`(\`order_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_2cc5c8fdd5d9215dfaf97d2496d\``);
        await queryRunner.query(`ALTER TABLE \`order_details\` DROP FOREIGN KEY \`FK_ce1f689e43b39edd9330cadaeb8\``);
        await queryRunner.query(`CREATE INDEX \`FK_a922b820eeef29ac1c6800e826a\` ON \`orders\` (\`user_id\`)`);
    }

}
