import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTitleTable1717089060860 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "title"
            (
                "id"         uuid         NOT NULL    DEFAULT uuid_generate_v4(),
                "name"       varchar(255) NOT NULL,
                "created_at" timestamp with time zone DEFAULT now(),
                "updated_at" timestamp with time zone DEFAULT now(),
                CONSTRAINT "pk_title_id" PRIMARY KEY ("id")
            );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            DROP TABLE IF EXISTS "title";
        `);
  }
}
