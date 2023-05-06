import { Controller, Post, Body, UseGuards, UnauthorizedException, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { AccessGuard, RefreshGuard } from './guards';
import { GetUser, GetUserId } from './decorators';
import { JwtPayloadWithRefreshToken } from './types';
import { EmailConstraintError, InvalidCredentials, InvalidToken } from './exceptions';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() user: SignUpUserDto) {
    try {
      return await this.authService.signUp(user);
    } catch (error) {
      if (error instanceof EmailConstraintError) {
        throw new UnauthorizedException(error.message);
      }
    }
  }

  @Post('signin')
  @HttpCode(200)
  async signIn(@Body() user: SignInUserDto) {
    try {
      return await this.authService.signIn(user);
    } catch (error) {
      if (error instanceof InvalidCredentials) {
        throw new UnauthorizedException(error.message);
      }
    }
  }

  @UseGuards(AccessGuard)
  @Post('logout')
  @HttpCode(200)
  async logout(@GetUserId() userId: string) {
    try {
      await this.authService.logout(userId);
    } catch (error) {
      throw new UnauthorizedException('Credentials incorrect');
    }
  }

  @UseGuards(RefreshGuard)
  @Post('refresh')
  @HttpCode(200)
  async refreshTokens(@GetUser() user: JwtPayloadWithRefreshToken) {
    try {
      return await this.authService.refreshTokens(user);
    } catch (error) {
      if (error instanceof InvalidToken) {
        throw new UnauthorizedException(error.message);
      }
    }
  }
}
