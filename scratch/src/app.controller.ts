import { Controller, Get } from "@nestjs/common";

@Controller()
export class AppController {
  @Get()
  getRootRoute() {
    return "Welcome to my nestjs app!";
  }

  @Get("/hello")
  getHello() {
    return "Hello World!";
  }
}
