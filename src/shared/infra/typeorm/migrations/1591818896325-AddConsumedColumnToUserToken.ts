import {
  MigrationInterface, QueryRunner, TableColumn, ColumnType,
} from 'typeorm';

export default class AddConsumedColumnToUserToken1591818896325 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    const type: ColumnType = 'bool';

    await queryRunner.addColumn('user_tokens', new TableColumn({
      name: 'consumed',
      type,
      default: false,
      isNullable: false,
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropColumn('user_tokens', 'consumed');
  }
}
