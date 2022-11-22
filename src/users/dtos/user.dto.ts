import { Exclude, Expose } from 'class-transformer';

export class UserDto {
  @Exclude()
  id: number;

  @Expose()
  email: string;
}
