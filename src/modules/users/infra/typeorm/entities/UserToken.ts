import {
  Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn,
} from 'typeorm';
import User from './User';

@Entity({ name: 'user_tokens' })
class UserToken {
  @Column()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @PrimaryGeneratedColumn('uuid')
  token: string;

  @Column({ name: 'user_id' })
  userID: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'provider_id' })
  user: User

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}

export default UserToken;