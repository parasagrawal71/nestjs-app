import { Injectable } from '@nestjs/common';
import { MessagesRepository } from './messages.repository';

@Injectable() // Marking it for injection in DI Container
export class MessagesService {
  // // IMPORTANT: Service is creating its own dependencies
  // // DONT DO THIS IN REAL APPS instead use dependency Injection
  // messagesRepo: MessagesRepository;
  // constructor() {
  //   this.messagesRepo = new MessagesRepository();
  // }

  // // With Dependency Injection
  // messagesRepo: MessagesRepository;
  // constructor(messagesRepo: MessagesRepository) {
  //   this.messagesRepo = messagesRepo;
  // }

  // |
  // | The above code can be condensed into the following line with public variable
  // \/

  constructor(public messagesRepo: MessagesRepository) {}

  findOne(id: string) {
    return this.messagesRepo.findOne(id);
  }

  findAll() {
    return this.messagesRepo.findAll();
  }

  create(message: string) {
    return this.messagesRepo.create(message);
  }
}
