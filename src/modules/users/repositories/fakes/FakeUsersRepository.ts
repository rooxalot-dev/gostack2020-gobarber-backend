import { uuid } from 'uuidv4';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import CreateUserDTO from '@modules/users/dtos/CreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';


export default class FakeUsersRepository implements IUsersRepository {
  private users: User[] = [];

  findByEmail(email: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.email === email);

    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

  findById(id: string): Promise<User | undefined> {
    const user = this.users.find((u) => u.id === id);

    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

  listAllProviders(exceptUserId?: string): Promise<User[]> {
    let usersList = this.users;

    if (exceptUserId) {
      usersList = this.users.filter((u) => u.id !== exceptUserId);
    }

    return new Promise((resolve, reject) => {
      usersList = usersList.filter((u) => u.isProvider === true);
      resolve(usersList);
    });
  }

  create({
    name, email, passwordHash, isProvider,
  }: CreateUserDTO): Promise<User> {
    const user = Object.assign(new User(), {
      id: uuid(), name, email, passwordHash, isProvider,
    });

    this.users.push(user);

    return new Promise((resolve, reject) => {
      resolve(user);
    });
  }

  async save({
    id, name, email, passwordHash,
  }: User): Promise<User> {
    let user: User;
    const userIndex = this.users.findIndex((u) => u.id === id);

    if (userIndex >= 0) {
      user = Object.assign(new User(), {
        id, name, email, passwordHash,
      });
      this.users[userIndex] = user;
    } else {
      user = await this.create({ name, email, passwordHash });
    }

    return user;
  }
}
