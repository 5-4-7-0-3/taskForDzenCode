import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1708340314169 implements MigrationInterface {
    name = 'Auto1708340314169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" ADD "user_id" integer`);
        await queryRunner.query(`ALTER TABLE "comment" ADD CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment" DROP CONSTRAINT "FK_bbfe153fa60aa06483ed35ff4a7"`);
        await queryRunner.query(`ALTER TABLE "comment" DROP COLUMN "user_id"`);
    }

}
