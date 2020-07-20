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
    const { NODE_ENV, S3_BUCKET, AWS_REGION } = process.env;

    if (!this.avatar) {
      return null;
    }

    if (NODE_ENV === 'production') {
      return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${this.avatar}`;
    }

    return `${APP_API_URL}/files/${this.avatar}`;
  }

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default User;
