import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  repo: Repository<User>;
  constructor(@InjectRepository(User) repo: Repository<User>) {
    this.repo = repo;
  }

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }
    const user = await this.repo.findOneBy({ id });
    if (!user) {
      throw new NotFoundException('No users with the given ID.');
    }
    return user;
  }

  find(email: string) {
    return this.repo.findBy({ email });
  }

  async update(id: number, updateData: Partial<User>) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('No users with the given ID.');
    }
    Object.assign(user, updateData);
    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException('No users with the given ID.');
    }
    return this.repo.remove(user);
  }
}
