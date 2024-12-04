// import {
//   ConnectedSocket,
//   MessageBody,
//   OnGatewayDisconnect,
//   SubscribeMessage,
//   WebSocketGateway,
//   WebSocketServer,
// } from '@nestjs/websockets';
// import { Server } from 'socket.io';
// import {
//   BadRequestException,
//   Logger,
//   NotFoundException,
//   OnModuleInit,
//   UseFilters,
//   UseGuards,
//   UsePipes,
//   ValidationPipe,
// } from '@nestjs/common';
// import { BaseService } from 'src/base/base.service';
// import { Subscription } from 'rxjs';
// import { WebsocketExceptionFilter } from '../utils/filters/ws-exception.filter';
// import { CreateChatMessageRequestDto } from './dto/create-chat-message-request.dto';
// import { ChatService } from './chat.service';
// import { WebsocketMessage } from './message-events.enum';
// import { EventsService } from '../events/events.service';
// import { AuthorizedSocket } from '../events/events.gateway';
// import { ADMIN_WAS_ADDED_TO_CHAT_MESSAGE } from './chat.constants';
// import { WsAccessGuard } from './ws-access.guard';
// import { RemoveChatOverseerRequestDto } from './dto/remove-chat-overseer-request.dto';
// import { CreateMessageRequest, Message } from './message.pb';
// import { Chat } from './chat.pb';
// import { AddChatOverseerRequestDto } from './dto/add-chat-overseer-request.dto';
// import { AddFavoriteMessageRequestDto } from './dto/add-favorite-message-request.dto';
// import { RemoveFavoriteMessageRequestDto } from './dto/remove-favorite-message-request.dto';
// import { ChangeMuteChatRequestDto } from './dto/change-mute-chat-request.dto';
// import { ChangeMuteChatResponseDto } from './dto/change-mute-chat-response.dto';
// import { RemoveChatOverseerResponseDto } from './dto/remove-chat-overseer-response.dto';
// import { RemoveChatTemporaryOverseerResponseDto } from './dto/remove-chat-temporary-overseer-response.dto';
// import { AddChatTemporaryOverseerResponseDto } from './dto/add-chat-temporary-overseer-response.dto';
// import { ChangePinChatRequestDto } from './dto/change-pin-chat-request.dto';
// import { ChangePinChatResponseDto } from './dto/change-pin-chat-response.dto';
// import { UpdateMessageStatusRequestDto } from './dto/update-message-status-request.dto';
// import { InviteAdminRequestDto } from './dto/invite-admin-request.dto';
// import { UserService } from '../user/user.service';
// import { ChatType } from './chat-enum.pb';
// import { MessageType } from './message-enum.pb';
// import { InviteAdminResponseDto } from './dto/invite-admin-response.dto';
// import { InitialTotalUnreadMessagesResponseDto } from './dto/initial-total-unread-messages-response.dto';
// import { UserRoles } from '../user/user-enums.pb';
// import { InitialTotalUnreadMessagesByLoginAccessesResponseDto } from './dto/initial-total-unread-messages-by-login-accesses-response.dto';
//
// @WebSocketGateway()
// @UseFilters(WebsocketExceptionFilter)
// // This class must be singleton due to cacheChatUpdate
// export class ChatGateway implements OnGatewayDisconnect, OnModuleInit {
//   @WebSocketServer()
//   server: Server;
//
//   private readonly logger = new Logger(ChatGateway.name);
//
//   private totalUnreadMessagesCountSubscription: Subscription;
//
//   private cacheChatUpdate = new Set();
//
//   constructor(
//     private readonly userService: UserService,
//     private readonly chatService: ChatService,
//     private readonly baseService: BaseService,
//     private readonly eventsService: EventsService,
//   ) {}
//
//   onModuleInit() {
//     this.subscribeTotalUnreadMessagesCount();
//   }
//
//   @UseGuards(WsAccessGuard)
//   @SubscribeMessage(WebsocketMessage.ADD_CHAT_TEMPORARY_OVERSEER)
//   @UsePipes(new ValidationPipe())
//   async addChatTemporaryOverseer(
//     @ConnectedSocket() socket: AuthorizedSocket,
//     @MessageBody()
//     data: AddChatOverseerRequestDto,
//   ): Promise<AddChatTemporaryOverseerResponseDto> {
//     this.logger.debug(
//       `ChatGateway::addChatTemporaryOverseer::${JSON.stringify(data)}`,
//     );
//
//     try {
//       await this.chatService.addChatTemporaryOverseer(
//         data.chatId,
//         socket.user.userId,
//         socket.id,
//       );
//
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   }
//
//   @UseGuards(WsAccessGuard)
//   @SubscribeMessage(WebsocketMessage.REMOVE_CHAT_TEMPORARY_OVERSEER)
//   @UsePipes(new ValidationPipe())
//   async removeChatTemporaryOverseer(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: RemoveChatOverseerRequestDto,
//   ): Promise<RemoveChatTemporaryOverseerResponseDto> {
//     this.logger.debug(
//       `ChatGateway::removeChatTemporaryOverseer::${JSON.stringify(data)}`,
//     );
//
//     try {
//       await this.chatService.removeChatTemporaryOverseer(
//         data.chatId,
//         user.userId,
//       );
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   }
//
//   @UseGuards(WsAccessGuard)
//   @SubscribeMessage(WebsocketMessage.ADD_CHAT_OVERSEER)
//   @UsePipes(new ValidationPipe())
//   async addChatOverseer(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: AddChatOverseerRequestDto,
//   ): Promise<void> {
//     this.logger.debug(`ChatGateway::addChatOverseer::${JSON.stringify(data)}`);
//     await this.chatService.removeChatTemporaryOverseer(
//       data.chatId,
//       user.userId,
//     );
//
//     const { data: rawChat } = await this.chatService.addChatOverseer({
//       chatId: data.chatId,
//       adminId: user.userId,
//     });
//
//     const [chat] = await this.baseService.appendComplexInformationInChats([
//       rawChat,
//     ]);
//
//     const { message } = await this.createChatMessage(
//       {
//         chatId: chat.id,
//         content: ADMIN_WAS_ADDED_TO_CHAT_MESSAGE,
//         type: MessageType.SYSTEM,
//       },
//       user.userId,
//     );
//
//     await this.sendChatMessages(
//       chat.id,
//       chat.participants.map((participant) => participant.userId),
//       {
//         chat,
//         message,
//       },
//     );
//   }
//
//   @UseGuards(WsAccessGuard)
//   @SubscribeMessage(WebsocketMessage.REMOVE_CHAT_OVERSEER)
//   @UsePipes(new ValidationPipe())
//   async removeChatOverseer(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: RemoveChatOverseerRequestDto,
//   ): Promise<RemoveChatOverseerResponseDto> {
//     this.logger.debug(
//       `ChatGateway::removeChatOverseer::${JSON.stringify(data)}`,
//     );
//
//     try {
//       await this.chatService.removeChatOverseer({
//         chatId: data.chatId,
//         adminId: user.userId,
//       });
//
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   }
//
//   @SubscribeMessage(WebsocketMessage.SEND_MESSAGE)
//   @UsePipes(new ValidationPipe())
//   async sendMessage(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: CreateChatMessageRequestDto,
//   ): Promise<void> {
//     this.logger.debug(`ChatGateway::sendMessage::${JSON.stringify(data)}`);
//     const { chat: rawChat, message } = await this.createChatMessage(
//       data,
//       user.userId,
//     );
//
//     const [chat] = await this.baseService.appendComplexInformationInChats([
//       rawChat,
//     ]);
//
//     await this.sendChatMessages(
//       chat.id,
//       chat.participants.map((participant) => participant.userId),
//       {
//         chat,
//         message,
//       },
//     );
//   }
//
//   async handleDisconnect(client: AuthorizedSocket): Promise<void> {
//     this.logger.debug(`ChatGateway::handleDisconnect::${client.id}`);
//
//     await this.chatService.removeTemporaryOverseerSocket(client.id);
//   }
//
//   // Message interactions
//
//   @SubscribeMessage(WebsocketMessage.ADD_FAVORITE_MESSAGE)
//   @UsePipes(new ValidationPipe())
//   async addFavoriteMessage(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: AddFavoriteMessageRequestDto,
//   ): Promise<void> {
//     this.logger.debug(
//       `ChatGateway::addFavoriteMessage::${JSON.stringify(data)}`,
//     );
//
//     await this.createOrRemoveFavoriteMessage(data, user.userId, {
//       toRemove: false,
//       successEvent: WebsocketMessage.ADDED_FAVORITE_MESSAGE,
//     });
//   }
//
//   @SubscribeMessage(WebsocketMessage.REMOVE_FAVORITE_MESSAGE)
//   @UsePipes(new ValidationPipe())
//   async removeFavoriteMessage(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: RemoveFavoriteMessageRequestDto,
//   ): Promise<void> {
//     this.logger.debug(
//       `ChatGateway::removeFavoriteMessage::${JSON.stringify(data)}`,
//     );
//
//     await this.createOrRemoveFavoriteMessage(data, user.userId, {
//       toRemove: true,
//       successEvent: WebsocketMessage.REMOVED_FAVORITE_MESSAGE,
//     });
//   }
//
//   @SubscribeMessage(WebsocketMessage.UPDATE_MESSAGE_STATUS)
//   @UsePipes(new ValidationPipe())
//   async updateMessageStatus(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: UpdateMessageStatusRequestDto,
//   ): Promise<void> {
//     this.logger.debug(
//       `ChatGateway::updateMessageStatus::${JSON.stringify(data)}`,
//     );
//
//     const { data: rawChat } =
//       await this.chatService.getChatByIdAndUserIdWithoutLastMessage({
//         chatId: data.chatId,
//         userId: user.userId,
//       });
//
//     if (!rawChat) {
//       throw new NotFoundException('Chat was not found');
//     }
//
//     const { data: message } = await this.chatService.updateMessageStatus({
//       ...data,
//       userId: user.userId,
//     });
//     if (!this.cacheChatUpdate.has(data.chatId)) {
//       this.cacheChatUpdate.add(data.chatId);
//       setTimeout(() => {
//         this.sendUpdatedMessageStatus(data, user.userId, message);
//         this.cacheChatUpdate.delete(data.chatId);
//       }, 1000);
//     }
//   }
//
//   private async sendUpdatedMessageStatus(
//     data: UpdateMessageStatusRequestDto,
//     userId: number,
//     message: Message,
//   ): Promise<void> {
//     const { data: updatedRawChat } =
//       await this.chatService.getChatByIdAndUserIdWithoutLastMessage({
//         chatId: data.chatId,
//         userId,
//       });
//
//     const [chat] = await this.baseService.appendComplexInformationInChats([
//       updatedRawChat,
//     ]);
//
//     const userIds = chat.participants.map((p) => p.userId);
//     const userSocketIds = await this.eventsService.getSocketConnectionsByUserId(
//       userIds,
//     );
//
//     userSocketIds.map((socketId) =>
//       this.server
//         .to(socketId)
//         .emit(WebsocketMessage.UPDATED_MESSAGE_STATUS, { chat, message }),
//     );
//   }
//
//   // Admin invitation
//   @SubscribeMessage(WebsocketMessage.INVITE_ADMIN)
//   @UsePipes(new ValidationPipe())
//   async inviteAdmin(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: InviteAdminRequestDto,
//   ): Promise<InviteAdminResponseDto> {
//     this.logger.debug(`ChatGateway::inviteAdmin::${JSON.stringify(data)}`);
//
//     const { data: ids } = await this.userService.getAllAdminsAndModeratorsIds();
//
//     if (ids.length === 0) {
//       return { success: false, message: WebsocketMessage.NO_ADMINS };
//     }
//
//     const { data: adminChats } =
//       await this.chatService.createAdminJoinRequestNotificationMessage({
//         chatId: data.chatId,
//         userId: user.userId,
//         adminIds: ids,
//       });
//
//     const { chat: rawChat, message } =
//       await this.chatService.createUserJoinRequestMessage({
//         chatId: data.chatId,
//         userId: user.userId,
//       });
//
//     const [chat] = await this.baseService.appendComplexInformationInChats([
//       rawChat,
//     ]);
//
//     await Promise.all(
//       adminChats.map(async (adminChat) =>
//         this.sendChatMessages(
//           adminChat.chat.id,
//           adminChat.chat.participants.map((p) => p.userId),
//           {
//             ...adminChat,
//             chat: await this.baseService.appendComplexInformationInChats([
//               adminChat.chat,
//             ]),
//           },
//         ),
//       ),
//     );
//
//     await this.sendChatMessages(
//       chat.id,
//       chat.participants.map((p) => p.userId),
//       { chat, message },
//     );
//     return { success: true };
//   }
//
//   // Chat interactions
//
//   @SubscribeMessage(WebsocketMessage.CHANGE_PIN_CHAT)
//   @UsePipes(new ValidationPipe())
//   async changePinChat(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: ChangePinChatRequestDto,
//   ): Promise<ChangePinChatResponseDto> {
//     this.logger.debug(`ChatGateway::pinChat::${JSON.stringify(data)}`);
//
//     try {
//       await this.chatService.changePinChat({
//         chatId: data.chatId,
//         userId: user.userId,
//         value: data.value,
//       });
//
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   }
//
//   @SubscribeMessage(WebsocketMessage.CHANGE_MUTE_CHAT)
//   @UsePipes(new ValidationPipe())
//   async changeMuteChat(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//     @MessageBody()
//     data: ChangeMuteChatRequestDto,
//   ): Promise<ChangeMuteChatResponseDto> {
//     this.logger.debug(`ChatGateway::muteChat::${JSON.stringify(data)}`);
//
//     try {
//       await this.chatService.changeMuteChat({
//         chatId: data.chatId,
//         userId: user.userId,
//         value: data.value,
//       });
//
//       return { success: true };
//     } catch (error) {
//       return { success: false, message: error.message };
//     }
//   }
//
//   @SubscribeMessage(WebsocketMessage.TOTAL_UNREAD_MESSAGES)
//   @UsePipes(new ValidationPipe())
//   async initialTotalUnreadMessages(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//   ): Promise<InitialTotalUnreadMessagesResponseDto> {
//     try {
//       const data = await this.chatService.getTotalUnreadMessagesCount({
//         userIds: [user.userId],
//       });
//       return {
//         totalUnreadMessagesCount: data.data[0].totalUnreadMessagesCount,
//       };
//     } catch (error) {
//       this.logger.error(`initialTotalUnreadMessages error: ${error.message}`);
//       return { message: error.message };
//     }
//   }
//
//   @SubscribeMessage(WebsocketMessage.TOTAL_UNREAD_MESSAGES_BY_LOGIN_ACCESSES)
//   @UsePipes(new ValidationPipe())
//   async initialTotalUnreadMessagesByLoginAccesses(
//     @ConnectedSocket() { user }: AuthorizedSocket,
//   ): Promise<InitialTotalUnreadMessagesByLoginAccessesResponseDto> {
//     const cachedUsers = await this.userService.getCachedUsers([user.userId]);
//     const cachedUser = cachedUsers.users[0];
//
//     if (cachedUser.role.role !== UserRoles.SUPER_CONTENT) {
//       return { message: 'No access for this role' };
//     }
//
//     const accessibleUserIds = cachedUser.userLoginAccesses.map(
//       (u) => u.accessibleUserId,
//     );
//
//     if (accessibleUserIds.length === 0) {
//       return { data: [] };
//     }
//
//     const data = await this.chatService.getTotalUnreadMessagesCount({
//       userIds: accessibleUserIds,
//     });
//     return {
//       data: data.data,
//     };
//   }
//
//   // Common logic
//
//   private async createOrRemoveFavoriteMessage(
//     data: AddFavoriteMessageRequestDto | RemoveFavoriteMessageRequestDto,
//     userId: number,
//     {
//       toRemove,
//       successEvent,
//     }: { toRemove: boolean; successEvent: WebsocketMessage },
//   ): Promise<void> {
//     const { data: rawChat } = await this.chatService.getChatByIdAndUserId({
//       chatId: data.chatId,
//       userId,
//     });
//
//     if (!rawChat) {
//       throw new NotFoundException('Chat was not found');
//     }
//
//     const [chat] = await this.baseService.appendComplexInformationInChats([
//       rawChat,
//     ]);
//
//     let message: Message;
//
//     if (toRemove) {
//       const { data: favoriteMessage } =
//         await this.chatService.removeFavoriteMessage({
//           messageId: data.messageId,
//           userId,
//           chatId: data.chatId,
//         });
//
//       message = favoriteMessage;
//     } else {
//       const { data: favoriteMessage } =
//         await this.chatService.addFavoriteMessage({
//           messageId: data.messageId,
//           userId,
//           chatId: data.chatId,
//         });
//
//       message = favoriteMessage;
//     }
//
//     await this.sendMessageByUserSockets(userId, successEvent, {
//       chat,
//       message,
//     });
//   }
//
//   private async sendMessageByUserSockets<T>(
//     userId: number,
//     message: WebsocketMessage,
//     data: T,
//   ): Promise<void> {
//     const sockets = await this.eventsService.getSocketConnectionsByUserId(
//       userId,
//     );
//
//     await Promise.all(
//       sockets.map((socketId) => this.server.to(socketId).emit(message, data)),
//     );
//   }
//
//   private async createChatMessage(
//     data: CreateChatMessageRequestDto,
//     senderId: CreateMessageRequest['senderId'],
//   ): Promise<{ chat: Chat; message: Message }> {
//     const { data: chat } =
//       await this.chatService.getChatByIdAndUserIdWithoutLastMessage({
//         chatId: data.chatId,
//         userId: senderId,
//       });
//
//     if (!chat) {
//       throw new NotFoundException('Chat was not found');
//     }
//
//     if (chat.type === ChatType.COMPLEX) {
//       const isChatBlocked = await this.userService.checkIfUsersWereBlocked(
//         // the first 2 participants in complex chats are always the users that should be verified for block
//         chat.participants[0].userId,
//         chat.participants[1].userId,
//       );
//
//       if (isChatBlocked) {
//         throw new BadRequestException('Chat is blocked');
//       }
//     }
//
//     const { data: message } = await this.chatService.createMessage({
//       chatId: data.chatId,
//       content: data.content,
//       senderId,
//     });
//
//     return { chat, message };
//   }
//
//   // Notifying users
//
//   private async sendChatMessages<T>(
//     chatId: string,
//     ids: number[],
//     data: T,
//   ): Promise<void> {
//     // eslint-disable-next-line no-restricted-syntax
//     for await (const id of ids) {
//       const recipientConnections =
//         await this.eventsService.getSocketConnectionsByUserId(id);
//
//       if (recipientConnections.length > 0) {
//         const { data: userChat } = await this.chatService.getChatByIdAndUserId({
//           chatId,
//           userId: id,
//         });
//
//         const [chat] = await this.baseService.appendComplexInformationInChats([
//           userChat,
//         ]);
//
//         recipientConnections.map((socketId) =>
//           this.server
//             .to(socketId)
//             .emit(WebsocketMessage.NEW_MESSAGE, { ...data, chat }),
//         );
//       }
//     }
//
//     const chatTemporaryOverseers =
//       await this.chatService.getChatTemporaryOverseers(chatId);
//
//     chatTemporaryOverseers.map((socketId) =>
//       this.server.to(socketId).emit(WebsocketMessage.NEW_MESSAGE, data),
//     );
//   }
//
//   // Subscription
//
//   private async subscribeTotalUnreadMessagesCount() {
//     this.totalUnreadMessagesCountSubscription?.unsubscribe();
//     this.totalUnreadMessagesCountSubscription = this.chatService
//       .subscribeTotalUnreadMessagesCount()
//       .subscribe({
//         next: async (data) => {
//           // send TOTAL_UNREAD_MESSAGES
//           // eslint-disable-next-line no-restricted-syntax
//           for (const { userId, totalUnreadMessagesCount } of data.data) {
//             const recipientConnections =
//               // eslint-disable-next-line no-await-in-loop
//               await this.eventsService.getSocketConnectionsByUserId(userId);
//             recipientConnections.map((socketId) =>
//               this.server
//                 .to(socketId)
//                 .emit(WebsocketMessage.TOTAL_UNREAD_MESSAGES, {
//                   totalUnreadMessagesCount,
//                 }),
//             );
//           }
//           // send TOTAL_UNREAD_MESSAGES_BY_LOGIN_ACCESSES
//           // check if there are any connected supercontent
//           // TODO: write getCachedUsers to get by roles
//           const superContents = await this.userService.getUsersFullInfo({
//             role: UserRoles.SUPER_CONTENT,
//           });
//           // eslint-disable-next-line no-restricted-syntax
//           for (const superContent of superContents.users) {
//             const userSocketConnections =
//               // eslint-disable-next-line no-await-in-loop
//               await this.eventsService.getSocketConnectionsByUserId(
//                 superContent.id,
//               );
//             // if supercontent is not online or haven't userLoginAccesses  need go to next
//             if (
//               userSocketConnections.length === 0 ||
//               superContent.userLoginAccesses.length === 0
//             ) {
//               // eslint-disable-next-line no-continue
//               continue;
//             }
//
//             // if userId from subscribe matches with supercontent loginaccesses need to recount
//             let isExist = false;
//             // eslint-disable-next-line no-restricted-syntax
//             for (const { accessibleUserId } of superContent.userLoginAccesses) {
//               const userIds = data.data.map((d) => d.userId);
//               if (userIds.includes(accessibleUserId)) {
//                 isExist = true;
//                 break;
//               }
//             }
//             if (isExist) {
//               const totalUnreadMessagesCount =
//                 // eslint-disable-next-line no-await-in-loop
//                 await this.chatService.getTotalUnreadMessagesCount({
//                   userIds: superContent.userLoginAccesses.map(
//                     (u) => u.accessibleUserId,
//                   ),
//                 });
//
//               userSocketConnections.map((socketId) =>
//                 this.server
//                   .to(socketId)
//                   .emit(
//                     WebsocketMessage.TOTAL_UNREAD_MESSAGES_BY_LOGIN_ACCESSES,
//                     {
//                       data: totalUnreadMessagesCount.data,
//                     },
//                   ),
//               );
//             }
//           }
//         },
//         error: (error) => {
//           this.logger.error(`error: ${error.message}`);
//         },
//       });
//     this.totalUnreadMessagesCountSubscription.add(() => {
//       setTimeout(() => {
//         this.logger.warn(`try reconnect totalUnreadMessagesCountSubscription`);
//         this.subscribeTotalUnreadMessagesCount();
//       }, 5000);
//     });
//   }
// }
