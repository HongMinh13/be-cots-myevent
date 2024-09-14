import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHumanResourcesRentalTable1717131420845
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "human_resources_rental"
            (
                "id"         uuid NOT NULL            DEFAULT uuid_generate_v4(),
                "human_resources_id"  uuid NOT NULL,
                "rental_id"  uuid NOT NULL,
                "quantity"   int,
                "created_at" timestamp with time zone DEFAULT now(),
                "updated_at" timestamp with time zone DEFAULT now(),
                CONSTRAINT "pk_human_resources_rental_id" PRIMARY KEY ("id"),
                CONSTRAINT "fk_human_resources_rental_human_resources_id" FOREIGN KEY ("human_resources_id") REFERENCES "human_resources" ("id"),
                CONSTRAINT "fk_human_resources_rental_rental_id" FOREIGN KEY ("rental_id") REFERENCES "rental" ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
