import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDeviceTable1714879650409 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "device" (
            "id"    uuid    NOT NULL    DEFAULT uuid_generate_v4(),
            "name"  varchar(255) NOT NULL,
            "img"   varchar(255),
            "hourly_rental_fee" float   DEFAULT 0,
            "quantity" integer NOT NULL DEFAULT 1,
            "created_at"   timestamp with time zone DEFAULT now(),
            "updated_at"   timestamp with time zone DEFAULT now(),
            CONSTRAINT "PK_device_id" PRIMARY KEY ("id"),
            CONSTRAINT "UNQ_device_name" UNIQUE ("name")
        )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
