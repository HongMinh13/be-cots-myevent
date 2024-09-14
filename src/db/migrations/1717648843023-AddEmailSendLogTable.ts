import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddEmailSendLogTable1717648843023 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE IF NOT EXISTS "email_send_log"
        (
            "id"          uuid NOT NULL            DEFAULT uuid_generate_v4(),
            "contract_id" uuid NOT NULL,
            "file_name"   varchar(255),
            "created_at"  timestamp with time zone DEFAULT now(),
            "updated_at"  timestamp with time zone DEFAULT now(),
            CONSTRAINT "pk_email_send_log_id" PRIMARY KEY ("id"),
            CONSTRAINT "fk_email_send_log_contract_id" FOREIGN KEY ("contract_id") REFERENCES "contract" ("id")
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        DROP TABLE IF EXISTS "email_send_log";
    `);
  }
}
