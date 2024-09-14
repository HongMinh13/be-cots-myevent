import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTiTleData1717126118523 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`
            insert into title (name)
            values ('Người tổ chức'), ('Nhân viên phục vụ'), ('Đầu bếp'), ('Nhân viên bếp'), ('Nhân viên trang trí'), ('Nhân viên âm thanh ánh sáng'), ('Nhiếp ảnh gia và quay phim'), ('MC'), 
                    ('Ban nhạc, DJ'), ('Nhân viên tiếp tân'), ('Nhân viên bảo vệ'), ('Nhân viên phụ trách trang phục'), ('Nhân viên vệ sinh')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    queryRunner.query(`SELECT 1;`);
  }
}
