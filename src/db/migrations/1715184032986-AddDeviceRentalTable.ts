import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceRentalTable1715184032986 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "device_rental"
        (
            "id"         uuid NOT NULL            DEFAULT uuid_generate_v4(),
            "device_id"  uuid NOT NULL,
            "rental_id"  uuid NOT NULL,
            "quantity"   int,
            "created_at" timestamp with time zone DEFAULT now(),
            "updated_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_device_rental_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_device_rental_user_id" FOREIGN KEY ("device_id") REFERENCES "device" ("id"),
            CONSTRAINT "fk_device_rental_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
