import { ROLE } from '@/common/constant';
import { PasswordUtil } from '@/providers/password';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAdminAccount1717260186698 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminPassword = '@Camille1234';
    const genPassword = await PasswordUtil.generateHash(adminPassword);
    const adminEmail = 'camille.admin@gmail.com';

    await queryRunner.query(`
        INSERT INTO "user" ("first_name", "last_name", "email", "password", "role_id") SELECT 'Admin','Account','${adminEmail}','${genPassword}', "role".id FROM "role" WHERE name ='${ROLE.Admin}'
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
