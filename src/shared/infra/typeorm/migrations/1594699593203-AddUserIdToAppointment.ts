import {
  MigrationInterface, QueryRunner, TableForeignKey, TableColumn,
} from 'typeorm';

export default class AddUserIdToAppointment1594699593203 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.addColumn('appointments', new TableColumn({
      name: 'user_id',
      type: 'varchar',
      isNullable: true,
    }));

    await queryRunner.createForeignKey('appointments', new TableForeignKey({
      name: 'fk_user_appointment',
      columnNames: ['user_id'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('appointments', 'fk_user_appointment');

    await queryRunner.dropColumn('appointments', 'user_id');
  }
}
