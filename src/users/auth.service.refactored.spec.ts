import { Test } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
  let fakeUsersService: Partial<UsersService>;
  let service: AuthService;

  let users: User[] = [];
  beforeEach(async () => {
    users = []; // to reset the users array before each test block gets executed

    /* mock implementation of the UsersService */
    fakeUsersService = {
      find: (email: string) => {
        const filteredUsers = users.filter((user) => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const newUser: User = {
          id: Math.floor(Math.random() * 999999),
          email,
          password
        } as User;
        users.push(newUser);
        return Promise.resolve(newUser);
      }
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        /* tricking the DI by providing the mock implementation as a substitute for 'UsersService' */
        {
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    /* extracting the AuthService from the testing module */
    service = module.get(AuthService);
  });

  it('can create and instance of AuthService', () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a hashed and salted password', async () => {
    const user = await service.signup('greencity@gmail.com', 'helloworld123');
    expect(user).toBeDefined();
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if signup is called with an email that is already in use', async () => {
    await service.signup('test@gmail.com', 'helloworld123');
    /* calling the signup() method with the same email */
    await expect(
      service.signup('test@gmail.com', 'helloworld133')
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if login is called with an unused email', async () => {
    await expect(
      service.login('unused@gmail.com', 'helloworld123')
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if login is called with an invalid password', async () => {
    await service.signup('newuser@gmail.com', 'helloworld123');
    await expect(
      service.login('newuser@gmail.com', 'wrongpw123')
    ).rejects.toThrow(BadRequestException);
  });

  it('returns a user instance if login is called with valid email and password', async () => {
    await service.signup('newuser@gmail.com', 'helloworld123');
    const user = await service.login('newuser@gmail.com', 'helloworld123');
    expect(user).toBeDefined();
  });
});
