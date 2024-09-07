import {MigrationInterface, QueryRunner} from "typeorm";

export class AddPhoneNumber1725662572179 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`ALTER TABLE "user_verification_request" ADD COLUMN "phone_number" VARCHAR(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.query(`ALTER TABLE "user_verification_request" DROP COLUMN "phone_number"`);
    }
}
