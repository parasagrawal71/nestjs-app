import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { CreateMessageDTO } from './dtos/create-message.dto';
import { MessagesService } from './messages.service';

@Controller('messages')
export class MessagesController {
  // // IMPORTANT: Service is creating its own dependencies
  // // DONT DO THIS IN REAL APPS instead use dependency Injection
  // messagesService: MessagesService;
  // constructor() {
  //   this.messagesService = new MessagesService();
  // }

  // // With Dependency Injection
  // messagesService: MessagesService;
  // constructor(messagesService: MessagesService) {
  //   this.messagesService = messagesService;
  // }

  // |
  // | The above code can be condensed into the following line with public variable
  // \/

  constructor(public messagesService: MessagesService) {}

  @Get()
  listMessages() {
    return this.messagesService.findAll();
  }

  @Post()
  createMessage(@Body() body: CreateMessageDTO) {
    console.log(`body: ${body}`);
    return this.messagesService.create(body.content);
  }

  @Get('/:id')
  async getMessage(@Param('id') id: string) {
    console.log(`id: ${id}`);
    const message = await this.messagesService.findOne(id);

    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }
}
