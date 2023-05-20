import { Controller, Get, UseGuards, HttpStatus } from '@nestjs/common';
import { AccessGuard } from 'src/auth/guards';
import { UserService } from './user.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { UserDto } from './dto';

@ApiTags('Users')
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @ApiOperation({ summary: 'Gets a list of users' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: UserDto })
  @UseGuards(AccessGuard)
  @Get()
  async getUsers() {
    return this.userService.getUsers();
  }
}
