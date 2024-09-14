import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEventTable1714899819123 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "event" (
            "id"    uuid    NOT NULL    DEFAULT uuid_generate_v4(),   
            "name" varchar(255) NOT NULL,
            "description" varchar(255),
            "img" varchar(255),
            "event_type_id" uuid NOT NULL,
            "event_format" boolean DEFAULT false,
            "is_template" boolean DEFAULT false,
            "online_link" varchar(255),
            "invitation_link" varchar(255),
            "rental_id" uuid NOT NULL,
            "created_at"   timestamp with time zone DEFAULT now(),
            "updated_at"   timestamp with time zone DEFAULT now(),
            CONSTRAINT "PK_event_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_event_event_type_id" FOREIGN KEY ("event_type_id") REFERENCES "event_type" ("id"),
            CONSTRAINT "FK_event_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
        )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
