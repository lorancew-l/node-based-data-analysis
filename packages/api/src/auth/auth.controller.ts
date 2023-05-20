import { Controller, Post, Body, UseGuards, UnauthorizedException, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { AccessGuard, RefreshGuard } from './guards';
import { GetUser, GetUserId } from './decorators';
import { JwtPayloadWithRefreshToken } from './types';
import { EmailConstraintError, InvalidCredentials, InvalidToken } from './exceptions';
import { ApiOperation, ApiTags, ApiResponse, ApiHeader } from '@nestjs/swagger';
import { TokenDto } from './dto/token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Creates new user account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TokenDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
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

  @ApiOperation({ summary: 'Logs in the user to account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TokenDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Logs out the user from account' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: null })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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

  @ApiOperation({ summary: 'Refreshes users token with the provided refresh token' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: TokenDto })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
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

      throw error;
    }
  }
}
