import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToContractTab1717139402677 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table contract add column "name" varchar(255) NOT NULL;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table contract drop column "name";
        `);
  }
}
