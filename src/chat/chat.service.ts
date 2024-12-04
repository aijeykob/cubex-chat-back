import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  public async getOrCreateChat(data) {
    this.logger.debug(`getOrCreateChat: ${JSON.stringify(data)}`);
    // return firstValueFrom(this.chatService.getOrCreateChat(data));
    return [{ a: 1 }];
  }
}
