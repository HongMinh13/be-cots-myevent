import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRentalTable1715182742122 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "user_rental"
    (
        "id"         uuid NOT NULL            DEFAULT uuid_generate_v4(),
        "user_id"    uuid NOT NULL,
        "rental_id"  uuid NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        CONSTRAINT "pk_user_rental_id" PRIMARY KEY ("id"),
        CONSTRAINT "fk_user_rental_user_id" FOREIGN KEY ("user_id") REFERENCES "user" ("id"),
        CONSTRAINT "fk_user_rental_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
    );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
