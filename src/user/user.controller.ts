import { Controller, Get, Logger, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('chat')
@ApiBearerAuth()
// @UseGuards(AuthGuard, ACGuard)
@Controller('user')
export class UserController {
  private readonly logger = new Logger(UserController.name);

  constructor(private userService: UserService) {}

  @Get('/')
  // @ApiResponse({
  //   type: GetOrCreateChatResponseDto,
  // })
  async getUsers() {
    // @Query() query: GetOrCreateChatQueryRequestDto, // @Body() getOrCreateChatRequest: GetOrCreateChatRequestDto, // @GetUser() { userId },
    // this.logger.debug(
    //   `getOrCreateChat: ${JSON.stringify(getOrCreateChatRequest)}`,
    // );
    const data = await this.userService.getUsers({});
    return data;
  }
}
