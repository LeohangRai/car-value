import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const users = await this.usersService.find(email);
    if (users.length) {
      throw new BadRequestException('Email already in use.');
    }
    // generate a salt
    const salt = randomBytes(8).toString('hex');

    // hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // join the hashed result and the salt together
    const result = `${salt}.${hash.toString('hex')}`;

    // create a new user and save it
    const user = await this.usersService.create(email, result);

    return user;
  }

  async login(email: string, password: string) {
    // destructuring because the find() method returns an array
    const [user] = await this.usersService.find(email);
    if (!user) {
      throw new BadRequestException('Invalid email or password!');
    }

    // fetch the user password hash and salt stored in the DB
    const [salt, storedHash] = user.password.split('.');

    // generate a hash by combining the user provided password and stored salt
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // compare the hash with the one stored in the database
    if (storedHash !== hash.toString('hex')) {
      throw new BadRequestException('Invalid email or password!');
    }
    return user;
  }
}
