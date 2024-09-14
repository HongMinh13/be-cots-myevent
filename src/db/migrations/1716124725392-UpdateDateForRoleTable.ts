import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDateForRoleTable1716124725392 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        INSERT INTO "role" (name) VALUES ('Employee');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
