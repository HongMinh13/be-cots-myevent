import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDetailToEventTable1717259968402 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE event
        ADD COLUMN detail text NOT NULL DEFAULT '';
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE event
        DROP COLUMN detail;
    `);
  }
}
