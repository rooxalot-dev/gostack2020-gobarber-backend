import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import CreateNotificationDTO from '@modules/notifications/dtos/CreateNotificationDTO';
import { MongoRepository, getMongoRepository } from 'typeorm';
import Notification from '../schemas/Notification';


export default class NotificationsRepository implements INotificationsRepository {
  ormRepository: MongoRepository<Notification>;

  constructor() {
    this.ormRepository = getMongoRepository(Notification, 'mongo');
  }

  async create({ recipientId, content }: CreateNotificationDTO): Promise<Notification> {
    const createdNotification = this.ormRepository.create({
      recipientId,
      content,
      isRead: false,
    });

    const savedNotification = await this.ormRepository.save(createdNotification);

    return savedNotification;
  }
}
