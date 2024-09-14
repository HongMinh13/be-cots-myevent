import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateGuestTable1717649251032 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        alter table "guest"
            drop CONSTRAINT IF EXISTS "fk_location_rental_rental_id",
            drop column event_id,
            add column "email_send_log_id" uuid,
            add CONSTRAINT "fk_guest_email_send_log_id" FOREIGN KEY ("email_send_log_id") REFERENCES "email_send_log" ("id")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
