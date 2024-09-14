import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventTypeTable1714878582231 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "event_type"
        (
            "id"    UUID    NOT NULL    DEFAULT uuid_generate_v4(),
            "name"  varchar(255) NOT NULL,
            "created_at"   timestamp with time zone DEFAULT now(),
            "updated_at"   timestamp with time zone DEFAULT now(),
            CONSTRAINT "PK_event_type_id" PRIMARY KEY ("id"),
            CONSTRAINT "UQ_event_type_name" UNIQUE ("name")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
