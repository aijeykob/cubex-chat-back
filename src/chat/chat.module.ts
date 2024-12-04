import { Global, Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
// import { ChatGateway } from './chat.gateway';

@Global()
@Module({
  imports: [],
  controllers: [ChatController],
  providers: [
    ChatService,
    // ChatGateway
  ],
  exports: [ChatService],
})
export class ChatModule {}
