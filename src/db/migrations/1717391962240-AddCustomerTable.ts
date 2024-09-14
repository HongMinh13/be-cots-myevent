import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCustomerTable1717391962240 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "customer"
            (
                "id"           uuid         NOT NULL    DEFAULT uuid_generate_v4(),
                "name"         varchar(255) NOT NULL,
                "phone_number" varchar(20),
                "address"      varchar(255),
                "created_at"   timestamp with time zone DEFAULT now(),
                "updated_at"   timestamp with time zone DEFAULT now(),
                CONSTRAINT "pk_customer_id" PRIMARY KEY ("id")
            );

            alter table rental
                drop column customer_name, drop column customer_address, drop column customer_phone_number;

            alter table contract add column customer_id uuid ,
                add constraint "fk_contract_customer_id" FOREIGN KEY ("customer_id") REFERENCES "customer" ("id");
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
