import { Module } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { UserSeedService } from './user-seed.service';

@Module({
  imports: [UserModule],
  providers: [UserSeedService],
  exports: [UserSeedService],
})
export class UserSeedModule {}
