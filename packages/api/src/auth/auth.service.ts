import { Injectable, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { SignInUserDto, SignUpUserDto } from './dto';

@Injectable()
export class AuthService {
  salt: number;

  jwtAccessSecret: string;
  jwtRefreshSecret: string;

  jwtAccessExpireTime: string;
  jwtRefreshExpireTime: string;

  constructor(private databaseService: DatabaseService, private jwtService: JwtService, configService: ConfigService) {
    this.salt = Number(configService.get('BCRYPT_SALT'));
    this.jwtAccessSecret = configService.get('JWT_ACCESS_SECRET');
    this.jwtRefreshSecret = configService.get('JWT_REFRESH_SECRET');
    this.jwtAccessExpireTime = configService.get('JWT_ACCESS_EXPIRE_TIME');
    this.jwtRefreshExpireTime = configService.get('JWT_REFRESH_EXPIRE_TIME');
  }

  async signUp(userData: SignUpUserDto) {
    const hash = await bcrypt.hash(userData.password, this.salt);

    const { id } = await this.databaseService.user.create({
      data: {
        ...userData,
        password: hash,
      },
    });

    return this.getTokens(id);
  }

  async signIn({ email, password }: SignInUserDto) {
    const user = await this.databaseService.user.findUnique({
      where: {
        email,
      },
    });

    const isPasswordMatches = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatches) {
      throw new ForbiddenException();
    }

    return this.getTokens(user.id);
  }

  async logout(userId: string) {
    return this.databaseService.token.delete({
      where: {
        userId,
      },
    });
  }

  async refreshTokens({ userId, refresh_token }: { userId: string; refresh_token: string }) {
    const { token: savedUserToken } = await this.databaseService.token.findUniqueOrThrow({
      where: { userId },
      select: { token: true },
    });

    const isTokenMatches = savedUserToken === refresh_token;

    if (isTokenMatches) {
      return this.getTokens(userId);
    }

    throw new ForbiddenException();
  }

  private async getTokens(userId: string) {
    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(
        { userId },
        {
          expiresIn: this.jwtAccessExpireTime,
          secret: this.jwtAccessSecret,
        },
      ),
      this.jwtService.signAsync(
        { userId },
        {
          expiresIn: this.jwtRefreshExpireTime,
          secret: this.jwtRefreshSecret,
        },
      ),
    ]);

    await this.databaseService.token.upsert({
      where: {
        userId,
      },
      update: {
        token: refresh_token,
      },
      create: {
        userId,
        token: refresh_token,
      },
    });

    return { access_token, refresh_token };
  }
}
