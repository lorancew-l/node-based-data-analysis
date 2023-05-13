import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessGuard } from 'src/auth/guards';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @UseGuards(AccessGuard)
  @Get('/user-list')
  async getUsers() {
    return this.userService.getUsers();
  }
}
