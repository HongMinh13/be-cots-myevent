import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeDefaultValueOfStatus1717173680978
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "contract" ALTER COLUMN "status" SET DEFAULT 0;
            ALTER TABLE "user" ALTER COLUMN "status" SET DEFAULT 0;
            ALTER TABLE "customer" ALTER COLUMN "status" SET DEFAULT 0;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
