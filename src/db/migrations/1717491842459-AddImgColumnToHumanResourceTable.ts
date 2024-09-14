import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImgColumnToHumanResourceTable1717491842459
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "human_resources" ADD column "img"   varchar(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`SELECT 1;`);
  }
}
