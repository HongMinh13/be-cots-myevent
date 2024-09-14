import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateLengthOfPhoneNumber1717227536552
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "rental" ALTER COLUMN "customer_phone_number" TYPE character varying(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
