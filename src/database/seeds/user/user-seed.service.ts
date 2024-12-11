import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { userSeeds } from './user-seed.constants';

@Injectable()
export class UserSeedService {
  private readonly nodeEnv: string;

  constructor(private readonly userService: UserService) {}

  async run(): Promise<void> {
    for (const user of userSeeds) {
      await this.userService.createUser(user);
    }
  }
}
