import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameSigningDate1717141931972 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "contract" RENAME COLUMN "signingDate" TO "signing_date"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "contract" RENAME COLUMN "signing_date
        " TO "signingDate"`,
    );
  }
}
