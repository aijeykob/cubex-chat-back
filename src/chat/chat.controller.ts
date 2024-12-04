import { Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@ApiBearerAuth()
// @UseGuards(AuthGuard, ACGuard)
@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private chatService: ChatService) {}

  @Get('/get-or-create')
  // @ApiResponse({
  //   type: GetOrCreateChatResponseDto,
  // })
  async getOrCreateChat() {
    // @Query() query: GetOrCreateChatQueryRequestDto, // @Body() getOrCreateChatRequest: GetOrCreateChatRequestDto, // @GetUser() { userId },
    // this.logger.debug(
    //   `getOrCreateChat: ${JSON.stringify(getOrCreateChatRequest)}`,
    // );
    const data = await this.chatService.getOrCreateChat({});
    return data;
  }
}
