import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContractTable1715415588844 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "contract"
        (
            "id"         uuid NOT NULL            DEFAULT uuid_generate_v4(),
            "rental_id"  uuid NOT NULL,
            "signingDate" timestamp with time zone DEFAULT now(),
            "created_at" timestamp with time zone DEFAULT now(),
            "updated_at" timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_contract_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_contract_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('SELECT 1;');
  }
}
