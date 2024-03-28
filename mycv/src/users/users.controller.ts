import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
  Session,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  Serialize,
  SerializeInterceptor,
} from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Serialize(UserDto)
@Controller('auth')
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {}

  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   // console.log('🚀 ~ UsersController ~ setColor ~ session:', session);
  //   session.color = color;
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   // console.log('🚀 ~ UsersController ~ getColor ~ session:', session);
  //   return session.color;
  // }

  @Post('/signup')
  createUser(@Body() body: CreateUserDto) {
    // this.usersService.create(body.email, body.password);
    return this.authService.signup(body.email, body.password);
  }

  // @UseInterceptors(ClassSerializerInterceptor) // STEP 2_2: It converts the user instance into plain object
  // @UseInterceptors(new SerializeInterceptor(UserDto)) // NOTE: Custom serializer
  // @Serialize(UserDto) // NOTE: Custom serializer with custom decorator
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.usersService.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  @Post('/signin')
  signin(@Body() body: CreateUserDto) {
    return this.authService.signin(body.email, body.password);
  }
}
