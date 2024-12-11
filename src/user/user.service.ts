import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getUsers(data) {
    this.logger.debug(`getOrCreateChat: ${JSON.stringify(data)}`);
    const users = await this.userRepository.find({});
    return { users };
  }

  async createUser(data: DeepPartial<User>): Promise<User> {
    this.logger.debug(`createUser: ${JSON.stringify(data)}`);
    const user = await this.userRepository.save(
      this.userRepository.create(data),
    );
    return user;
  }
}
