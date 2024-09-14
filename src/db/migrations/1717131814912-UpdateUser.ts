import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateUser1717131814912 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            alter table "user" drop constraint "fk_user_title_id";
            alter table "user" drop column "title_id";
            drop table title;
            drop table user_rental;
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
