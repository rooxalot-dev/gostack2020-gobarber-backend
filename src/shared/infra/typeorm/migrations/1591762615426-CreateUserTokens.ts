import {
  MigrationInterface, QueryRunner, Table, TableForeignKey,
} from 'typeorm';

export default class CreateUserTokens1591762615426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(new Table({
      name: 'user_tokens',
      columns: [
        {
          name: 'id',
          type: 'uuid',
          isPrimary: true,
          isGenerated: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'token',
          type: 'uuid',
          isGenerated: true,
          default: 'uuid_generate_v4()',
        },
        {
          name: 'user_id',
          type: 'varchar',
        },
        {
          name: 'created_at',
          type: 'timestamp with time zone',
          isNullable: false,
          default: 'now()',
        },
        {
          name: 'updated_at',
          type: 'timestamp with time zone',
          isNullable: false,
          default: 'now()',
        },
      ],
    }));

    await queryRunner.createForeignKey('user_tokens', new TableForeignKey({
      name: 'fk_user_token',
      columnNames: ['user_id'],
      referencedTableName: 'users',
      referencedColumnNames: ['id'],
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE',
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropForeignKey('user_tokens', 'fk_user_token');

    await queryRunner.dropTable('user_tokens');
  }
}
