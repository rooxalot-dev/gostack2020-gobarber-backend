import {
  Entity, Column, CreateDateColumn, UpdateDateColumn, ObjectIdColumn, ObjectID,
} from 'typeorm';

@Entity({ name: 'notifications' })
class Notification {
  @ObjectIdColumn()
  id: ObjectID;

  @Column()
  content: string;

  @Column()
  recipientId: string;

  @Column({ default: false })
  isRead: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

export default Notification;
