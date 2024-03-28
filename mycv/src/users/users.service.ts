import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  //   repo: Repository<User>;
  //   constructor(repo: Repository<User>) {
  //     this.repo = repo;
  //   }
  //     ||
  //     \/
  // constructor(private repo: Repository<User>) {}
  constructor(@InjectRepository(User) private repo: Repository<User>) {} // IMPORTANT: Because of '@InjectRepository(User)' we don't need to create repository explicitly

  create(email: string, password: string) {
    const user = this.repo.create({
      email,
      password,
    }); // NOTE: Returns a user entity instance

    return this.repo.save(user);

    // return this.repo.save({ email, password });
    // NOTE: This also works but the upper one is recommended for validation at entity level and hooks such as AfterInsert are not executed in this case
  }

  findOne(id: number) {
    return this.repo.findOneBy({ id });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, attrs: Partial<User>) {
    // return this.repo.update({ id }, attrs); // NOTE: It works but without excuting hooks

    const user = await this.findOne(id);
    if (!user) {
      return new Error('User not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async remove(id: number) {
    // return this.repo.delete(id); // NOTE: It works but without excuting hooks

    const user = await this.findOne(id);
    if (!user) {
      return new Error('User not found');
    }
    return this.repo.remove(user);
  }
}
