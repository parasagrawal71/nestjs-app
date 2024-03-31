import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // // Create a fake copy of the users service
    // fakeUsersService = {
    //   // NOTE: 'Partial<UsersService>'
    //   find: () => Promise.resolve([]),
    //   create: (email: string, password: string) =>
    //     Promise.resolve({ id: 1, email, password } as User), // NOTE: 'as User'
    // };

    // IMPORTANT: More Intelligent mocks
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 999999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('Creates a new user with a salted and hashed password', async () => {
    const user = await service.signup('test@gmail.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if email is in use', () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        { id: 1, email: 'test@gmail.com', password: 'pass' } as User,
      ]);

    // NOT WORKING
    // Function definition: async (done)
    // try {
    //   await service.signup('test@gmail.com', 'password');
    // } catch (err) {
    //   done();
    // }

    expect(service.signup('test@gmail.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Throws an error if user not found', async () => {
    expect(service.signin('test@gmail.com', 'password')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('Throws an error if invalid password is provided', async () => {
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'test@gmail.com',
          password: 'qedsaqwwwe',
        } as User,
      ]);

    expect(service.signin('test@gmail.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('Successful signin', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'test@gmail.com',
    //       password:
    //         '289d57a83c35c6af.dd44a575fd88f4586bba3a20a5688bb7c0ea455a5314f99272e57115123dfeb2',
    //     } as User,
    //   ]);

    // IMPORTANT: In case of 'More Intelligent mocks'
    await service.signup('test@gmail.com', 'secure-password');

    const user = await service.signin('test@gmail.com', 'secure-password');
    expect(user).toBeDefined();
  });
});
