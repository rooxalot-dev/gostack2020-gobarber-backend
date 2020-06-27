import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export default class AddIsProviderColumnToUSer1593221181762 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('users', new TableColumn({
      name: 'is_provider',
      type: 'bool',
      default: 'false',
      isNullable: false,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('users', 'is_provider');
  }
}
