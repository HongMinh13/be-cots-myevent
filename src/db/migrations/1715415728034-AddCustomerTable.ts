import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerTable1715415728034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "customer"
        (
            "id"         uuid         NOT NULL    DEFAULT uuid_generate_v4(),
            "event_id"   uuid         NOT NULL,
            "email"      varchar(255) NOT NULL,
            "status"     int,
            "created_at" timestamp with time zone DEFAULT now(),
            "updated_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_customer_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_customer_event_id" FOREIGN KEY ("event_id") REFERENCES "event" ("id")
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
