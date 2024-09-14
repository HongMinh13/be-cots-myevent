import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDescriptionToServiceTable1717238724311
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table device
        add column description text;

        alter table human_resources
        add column description text;

        alter table location
        add column description text;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
