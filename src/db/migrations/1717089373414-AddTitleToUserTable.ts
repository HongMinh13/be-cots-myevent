import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTitleToUserTable1717089373414 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table "user"
            add column title_id uuid,
            add constraint "fk_user_title_id" FOREIGN KEY ("title_id") REFERENCES "title" ("id");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table "user"
            drop column title_id;
        `);
  }
}
