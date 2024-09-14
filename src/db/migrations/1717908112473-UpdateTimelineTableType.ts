import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateTimelineTableType1717908112473
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "timeline"
            alter column "time_start" type time,
            alter column "time_end" type time,
            add column "day_in_timeline" int;
        alter table "event" alter column "description" type text;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
