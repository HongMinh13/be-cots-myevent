import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationRentalTable1715184185151 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "location_rental"
        (
            "id"         uuid NOT NULL            DEFAULT uuid_generate_v4(),
            "location_id"    uuid NOT NULL,
            "rental_id"  uuid NOT NULL,
            "created_at" timestamp with time zone DEFAULT now(),
            "updated_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_location_rental_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_location_rental_user_id" FOREIGN KEY ("location_id") REFERENCES "location" ("id"),
            CONSTRAINT "fk_location_rental_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
        );    
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
