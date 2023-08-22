import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692612906345 implements MigrationInterface {
    name = 'Migration1692612906345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`orders\` (\`order_id\` int NOT NULL AUTO_INCREMENT, \`order_receiver\` varchar(255) NOT NULL, \`order_phone\` varchar(255) NOT NULL, \`order_email\` varchar(255) NOT NULL, \`order_address\` varchar(255) NOT NULL, \`order_payment_amount\` int NOT NULL, \`order_status\` varchar(255) NOT NULL DEFAULT '1', \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (\`order_id\`)) ENGINE=InnoDB`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE \`orders\``);
    }

}
