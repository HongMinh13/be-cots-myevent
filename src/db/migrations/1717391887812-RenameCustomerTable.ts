import { MigrationInterface, QueryRunner } from 'typeorm';

export class RenameCustomerTable1717391887812 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "customer" RENAME TO "guest";
      ALTER TABLE "guest" RENAME CONSTRAINT "pk_customer_id" TO "pk_guest_id";`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
