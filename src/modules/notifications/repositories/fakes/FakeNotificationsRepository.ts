import { uuid } from 'uuidv4';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';


export default class FakeNotificationsRepository implements INotificationsRepository {
  notifications: Notification[] = [];

  create({ recipientId, content }: CreateNotificationDTO): Promise<Notification> {
    const newNotification = Object.assign(new Notification(), {
      id: uuid(),
      recipientId,
      content,
      isRead: false,
      createdAt: new Date(),
      updateddAt: new Date(),
    });

    this.notifications.push(newNotification);

    return new Promise((resolve, reject) => {
      resolve(newNotification);
    });
  }
}
