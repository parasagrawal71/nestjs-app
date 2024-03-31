import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeAuthService: Partial<AuthService>;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    fakeUsersService = {
      find: (email: string) =>
        Promise.resolve([{ id: 1, email, password: 'pass' }]),
    };

    fakeAuthService = {
      // signup: async (email: string, password: string) =>
      //   Promise.resolve({ id: 1, email, password } as User),
      signin: async (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: AuthService, useValue: fakeAuthService },
        { provide: UsersService, useValue: fakeUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Find all users with the given email id', async () => {
    const users = await controller.findAllUsers('test@gmail.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@gmail.com');
  });

  it('signin returns user and updates session object', async () => {
    let session: any = {};
    const user = await controller.signin(
      { email: 'test@gmail.com', password: 'pass' },
      session,
    );
    expect(user).toBeDefined();
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
