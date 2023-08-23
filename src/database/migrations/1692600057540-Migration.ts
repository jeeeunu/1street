import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1692600057540 implements MigrationInterface {
    name = 'Migration1692600057540'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`FK_bb9c758dcc60137e56f6fee72f7\``);
        await queryRunner.query(`ALTER TABLE \`shops\` CHANGE \`user_id\` \`userId\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shops\` ADD CONSTRAINT \`FK_48152549b90b2c8817139aa375b\` FOREIGN KEY (\`userId\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`shops\` DROP FOREIGN KEY \`FK_48152549b90b2c8817139aa375b\``);
        await queryRunner.query(`ALTER TABLE \`shops\` CHANGE \`userId\` \`user_id\` int NULL`);
        await queryRunner.query(`ALTER TABLE \`shops\` ADD CONSTRAINT \`FK_bb9c758dcc60137e56f6fee72f7\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
