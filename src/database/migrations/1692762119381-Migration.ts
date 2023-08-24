import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692762119381 implements MigrationInterface {
    name = 'Migration1692762119381'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_details\` (\`order_detail_id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`order_quantity\` int NOT NULL, \`order_id\` int NOT NULL, PRIMARY KEY (\`order_detail_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`order_receiver\` varchar(255) NOT NULL, \`order_phone\` varchar(255) NOT NULL, \`order_email\` varchar(255) NOT NULL, \`order_address\` varchar(255) NOT NULL, \`order_payment_amount\` int NOT NULL, \`order_status\` varchar(255) NOT NULL DEFAULT '1', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`user_id\` int NOT NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_a922b820eeef29ac1c6800e826a\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_a922b820eeef29ac1c6800e826a\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`order_details\``);
    }

}
