import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692688540342 implements MigrationInterface {
    name = 'Migration1692688540342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`order_details\` (\`order_detail_id\` int NOT NULL AUTO_INCREMENT, \`product_id\` int NOT NULL, \`order_quantity\` int NOT NULL, PRIMARY KEY (\`order_detail_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`order_receiver\` varchar(255) NOT NULL, \`order_phone\` varchar(255) NOT NULL, \`order_email\` varchar(255) NOT NULL, \`order_address\` varchar(255) NOT NULL, \`order_payment_amount\` int NOT NULL, \`order_status\` varchar(255) NOT NULL DEFAULT '1', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, \`orderIdOrderDetailId\` int NULL, \`userId\` int NULL, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_86ff9a3d241d36dc67d594c63a6\` FOREIGN KEY (\`orderIdOrderDetailId\`) REFERENCES \`order_details\`(\`order_detail_id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`orders\` ADD CONSTRAINT \`FK_151b79a83ba240b0cb31b2302d1\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_151b79a83ba240b0cb31b2302d1\``);
        await queryRunner.query(`ALTER TABLE \`orders\` DROP FOREIGN KEY \`FK_86ff9a3d241d36dc67d594c63a6\``);
        await queryRunner.query(`DROP TABLE \`orders\``);
        await queryRunner.query(`DROP TABLE \`order_details\``);
    }

}
