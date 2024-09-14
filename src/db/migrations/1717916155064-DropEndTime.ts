import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropEndTime1717916155064 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "timeline"
            drop column "time_end",
            drop column "detail";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
