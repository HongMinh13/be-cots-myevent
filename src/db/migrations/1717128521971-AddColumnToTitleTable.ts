import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnToTitleTable1717128521971 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table "user"
            drop column hourly_salary;
        alter table title
            add column hourly_salary float8 NOT NULL DEFAULT 0;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
