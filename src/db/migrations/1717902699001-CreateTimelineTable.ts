import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTimelineTable1717902699001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "timeline"
        (
            "id"          uuid NOT NULL            DEFAULT uuid_generate_v4(),
            "rental_id" uuid NOT NULL,
            "time_start"   timestamp with time zone,
            "time_end"   timestamp with time zone,
            "description" text,
            "detail" text,
            "created_at"  timestamp with time zone DEFAULT now(),
            "updated_at"  timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_timeline_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_timeline_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
