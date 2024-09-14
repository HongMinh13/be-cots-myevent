import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateStartTimeType1717926970301 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "timeline" 
                Drop COLUMN "time_start",
                DROP COLUMN "day_in_timeline",
                add COLUMN "time_start" TIMESTAMP WITH TIME ZONE
            `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
