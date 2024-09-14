import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropContractNameFromRentalTable1717213614796
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE rental DROP COLUMN contract_name`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE rental ADD COLUMN contract_name`);
  }
}
