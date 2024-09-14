import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateEventRentalTable1717651652704 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
        alter table "event"
            drop constraint "FK_event_rental_id",
            drop column "rental_id";
        alter table "rental"
            add column "event_id" uuid,
            add CONSTRAINT "fk_rental_event_id" FOREIGN KEY ("event_id") REFERENCES "event" ("id");
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
