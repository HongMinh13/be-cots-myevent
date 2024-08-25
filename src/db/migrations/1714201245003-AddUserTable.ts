import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1714201245003 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "user"
        (
            "id"           uuid         NOT NULL    DEFAULT uuid_generate_v4(),
            "role_id"      uuid         NOT NULL,
            "email"        varchar(255) NOT NULL,
            "password"     varchar      NOT NULL,
            "first_name"   varchar(255),
            "last_name"    varchar(255),
            "avatar"       varchar(255),
            "phone_number"  varchar(255),
            "gender"       boolean,
            "status"       int,
            "dob"          date,
            "hourly_salary" float8       NOT NULL    DEFAULT 0,
            "created_at"   timestamp with time zone DEFAULT now(),
            "updated_at"   timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_user_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_user_role_id" FOREIGN KEY ("role_id") REFERENCES "role" ("id"),
            CONSTRAINT "unq_user_email" UNIQUE ("email")
        );
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "user"
    `);
  }
}
