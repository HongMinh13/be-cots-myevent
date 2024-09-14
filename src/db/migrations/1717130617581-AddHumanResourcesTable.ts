import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddHumanResourcesTable1717130617581 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "human_resources"
            (
                "id"            uuid         NOT NULL    DEFAULT uuid_generate_v4(),
                "name"          varchar(255) NOT NULL,
                "hourly_salary" float8       NOT NULL    DEFAULT 0,
                "quantity"      integer      NOT NULL    DEFAULT 1,
                "created_at"    timestamp with time zone DEFAULT now(),
                "updated_at"    timestamp with time zone DEFAULT now(),
                CONSTRAINT "pk_human_resources_id" PRIMARY KEY ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
