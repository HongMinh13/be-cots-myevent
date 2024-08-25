import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRentalTable1714879889104 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "rental" (
            "id"    uuid    NOT NULL    DEFAULT uuid_generate_v4(),
            "user_id" uuid,
            "total_price"  float DEFAULT 0,
            "rental_start_time" timestamp with time zone  DEFAULT now(),
            "rental_end_time" timestamp with time zone,
            "created_at"   timestamp with time zone DEFAULT now(),
            "updated_at"   timestamp with time zone DEFAULT now(),
            CONSTRAINT "PK_rental_id" PRIMARY KEY ("id"),
            CONSTRAINT "FK_rental_user_id" FOREIGN KEY ("user_id") REFERENCES "user" ("id")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
