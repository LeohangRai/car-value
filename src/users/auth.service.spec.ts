import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    // mock implementation of the UsersService
    fakeUsersService = {
      find: () => Promise.resolve([]),
      create: (email: string, password: string) =>
        Promise.resolve({ id: 1, email, password } as User)
    };

    // creating a testing module
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          /* tricking the DI by providing the mock implementation as a substitute for 'UsersService' */
          provide: UsersService,
          useValue: fakeUsersService
        }
      ]
    }).compile();

    // extracting the AuthService from the testing module
    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new users with a hashed and salted password', async () => {
    const user = await service.signup('greencity@gmail.com', 'helloworld123');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if the user signs up with an email that is already in use', async () => {
    /* overriding the find() method to return a non-empty array for current test scenario */
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'greencity@gmail.com',
          password: 'helloworld123'
        } as User
      ]);
    await expect(
      service.signup('greencity@gmail.com', 'helloworld123')
    ).rejects.toThrow(BadRequestException);
  });
});
