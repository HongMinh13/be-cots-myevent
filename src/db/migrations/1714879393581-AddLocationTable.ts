import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddLocationTable1714879393581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "location" (
                "id"    uuid    NOT NULL    DEFAULT uuid_generate_v4(),
                "name"  varchar(255) NOT NULL,
                "img"   varchar(255),
                "hourly_rental_fee" float   DEFAULT 0,
                "address" varchar(255)   NOT NULL,
                "created_at"   timestamp with time zone DEFAULT now(),
                "updated_at"   timestamp with time zone DEFAULT now(),
                CONSTRAINT "PK_location_id" PRIMARY KEY ("id"),
                CONSTRAINT "UNQ_location_name" UNIQUE ("name")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
