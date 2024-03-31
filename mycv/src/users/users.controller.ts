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
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import {
  Serialize,
  SerializeInterceptor,
} from '../interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
// @UseGuards(AuthGuard)
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
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    // this.usersService.create(body.email, body.password);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // // @UseInterceptors(ClassSerializerInterceptor) // STEP 2_2: It converts the user instance into plain object
  // // @UseInterceptors(new SerializeInterceptor(UserDto)) // NOTE: Custom serializer
  // // @Serialize(UserDto) // NOTE: Custom serializer with custom decorator
  // @Get('/:id')
  // async findUser(@Param('id') id: string) {
  //   const user = await this.usersService.findOne(parseInt(id));
  //   if (!user) {
  //     throw new NotFoundException('User not found');
  //   }
  //   return user;
  // }

  @Get()
  findAllUsers(@Query('email') email: string) {
    return this.usersService.find(email);
  }

  // @Delete('/:id')
  // removeUser(@Param('id') id: string) {
  //   return this.usersService.remove(parseInt(id));
  // }

  // @Patch('/:id')
  // updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
  //   return this.usersService.update(parseInt(id), body);
  // }

  @Post('/signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   // console.log('🚀 ~ UsersController ~ whoAmI ~ session:', session);
  //   return this.usersService.findOne(session.userId);
  // }
  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    // console.log('🚀 ~ UsersController ~ whoAmI ~ user:', user);
    return user;
  }

  @Post('/signout')
  async signout(@Session() session: any) {
    session.userId = null;
  }
}
