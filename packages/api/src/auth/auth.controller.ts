import { Controller, Post, Body, UseGuards, ForbiddenException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { AccessGuard, RefreshGuard } from './guards';
import { User, UserId } from './decorators';
import { JwtPayloadWithRefreshToken } from './types';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: SignUpUserDto) {
    try {
      return await this.authService.signUp(user);
    } catch (error) {
      console.error('Error', error);
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  @Post('signin')
  async signIn(@Body() user: SignInUserDto) {
    return this.authService.signIn(user);
  }

  @UseGuards(AccessGuard)
  @Post('logout')
  async logout(@UserId() userId: string) {
    try {
      await this.authService.logout(userId);
    } catch (error) {
      console.error('Error', error);
      throw new ForbiddenException('Credentials incorrect');
    }
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  async refreshTokens(@User() user: JwtPayloadWithRefreshToken) {
    try {
      await this.authService.refreshTokens(user);
    } catch (error) {
      console.error('Error', error);
      throw new ForbiddenException('Credentials incorrect');
    }
  }
}
