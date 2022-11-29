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

  it('throws an error if login is called with an unused email', async () => {
    /* 
    no need to override the fakeUsersService.find() method to return a non-empty array for current test scenario
    because we just want to test whether an exception is thrown when no users are found for the given email, i.e. when the usersService returns an empty array
    */
    await expect(
      service.login('unused@gmail.com', 'helloworld123')
    ).rejects.toThrow(BadRequestException);
  });

  it('throws an error if an invalid password is provided', async () => {
    /* 
    overriding the find() method to return a non-empty array for current test scenario
    because we want the password comparison blocks to run and returning an empty array would result in throwing of BadRequestException in an earlier phase, which would block the password comparison logic from executing 
    */
    fakeUsersService.find = () =>
      Promise.resolve([
        {
          id: 1,
          email: 'greencity@gmail.com',
          password: 'helloworld123'
        } as User
      ]);
    await expect(
      service.login('greencity@gmail.com', 'random-password')
    ).rejects.toThrow(BadRequestException);
  });
});
