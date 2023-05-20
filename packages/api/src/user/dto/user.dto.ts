import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

export class UserDto implements Omit<User, 'password'> {
  @ApiProperty()
  id: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  firstName: string;

  @ApiProperty()
  lastName: string;
}
