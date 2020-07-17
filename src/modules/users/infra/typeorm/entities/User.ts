import { Exclude, Expose } from 'class-transformer';
import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn,
} from 'typeorm';

const { APP_API_URL } = process.env;

@Entity({ name: 'users' })
class User {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column({ name: 'is_provider' })
  isProvider: boolean;

  @Column({ name: 'password_hash', type: 'varchar' })
  @Exclude()
  passwordHash: string;

  @Column()
  avatar: string;

  @Expose({ name: 'avatarUrl' })
  getAvatarUrl(): string | null {
    return this.avatar ? `${APP_API_URL}/files/${this.avatar}` : null;
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default User;
