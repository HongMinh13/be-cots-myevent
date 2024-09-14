import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateRentalTable1717083104254 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table rental
            add column contract_name varchar(255),
            add column customer_name varchar(255),
            add column customer_phone_number varchar(10),
            add column customer_address varchar(255),
            add column custom_location varchar(255);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
        alter table rental
            drop column contract_name,
            drop column customer_name,
            drop column customer_phone_number,
            drop column customer_address,
            drop column custom_location;
    `);
  }
}
