import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddPaymentIntentToContract1717172606058
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(
      `ALTER TABLE "contract" ADD COLUMN "payment_intent_id" VARCHAR(255)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`ALTER TABLE "contract" DROP COLUMN "payment_intent_id"`);
  }
}
