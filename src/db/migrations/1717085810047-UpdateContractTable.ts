import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateContractTable1717085810047 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            alter table contract
                add column status int;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            alter table contract
                drop column status;
        `);
  }
}
