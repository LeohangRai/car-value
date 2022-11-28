import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    // mock implementation of the UsersService
    const fakeUsersService: Partial<UsersService> = {
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
});
