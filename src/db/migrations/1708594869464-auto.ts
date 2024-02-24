import { MigrationInterface, QueryRunner } from "typeorm";

export class Auto1708594869464 implements MigrationInterface {
    name = 'Auto1708594869464'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "captcha" TO "imgUrl"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "imgUrl" TO "captcha"`);
    }

}
