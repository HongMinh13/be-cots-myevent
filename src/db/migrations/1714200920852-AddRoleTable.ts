import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleTable1714200920852 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "role"
    (
        "id"         uuid         NOT NULL    DEFAULT uuid_generate_v4(),
        "name"       varchar(255) NOT NULL,
        "created_at" timestamp with time zone DEFAULT now(),
        "updated_at" timestamp with time zone DEFAULT now(),
        CONSTRAINT "pk_role_id" PRIMARY KEY ("id")
    );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "role"
    `);
  }
}
