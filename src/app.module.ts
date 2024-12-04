import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [ChatModule],
  providers: [AppService],
})
export class AppModule {}
