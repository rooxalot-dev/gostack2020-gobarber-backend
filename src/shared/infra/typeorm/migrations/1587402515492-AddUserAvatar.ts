import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddUserAvatar1587402515492 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'avatar',
      type: 'varchar',
      isNullable: true,
      comment: "Path/URL to user's avatar image",
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('users', 'avatar');
  }
}
