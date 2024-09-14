import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddErrorColumnToGuestTable1717586461406
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guest" ADD COLUMN "error" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "guest" DROP COLUMN "error"`);
  }
}
