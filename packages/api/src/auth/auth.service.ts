import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { pick } from 'lodash';
import * as bcrypt from 'bcrypt';
import { DatabaseService } from 'src/database/database.service';
import { SignInUserDto, SignUpUserDto } from './dto';
import { EmailConstraintError, InvalidCredentials, InvalidToken } from './exceptions';

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

    const user = await this.databaseService.user
      .create({
        data: {
          ...userData,
          password: hash,
        },
      })
      .catch(() => {
        throw new EmailConstraintError();
      });

    return this.getTokens(user);
  }

  async signIn({ email, password }: SignInUserDto) {
    const user = await this.databaseService.user
      .findUniqueOrThrow({
        where: {
          email,
        },
      })
      .catch(() => {
        throw new InvalidCredentials();
      });

    const isPasswordMatches = await bcrypt.compare(password, user?.password);

    if (!isPasswordMatches) {
      throw new InvalidCredentials();
    }

    return this.getTokens(user);
  }

  async logout(userId: string) {
    return this.databaseService.token.delete({
      where: {
        userId,
      },
    });
  }

  async refreshTokens(user: User & { refresh_token: string }) {
    const { token: savedUserToken } = await this.databaseService.token.findUniqueOrThrow({
      where: { userId: user.id },
      select: { token: true },
    });

    const isTokenMatches = savedUserToken === user.refresh_token;

    if (isTokenMatches) {
      return this.getTokens(user);
    }

    throw new InvalidToken();
  }

  private async getTokens(user: User) {
    const payload = pick(user, ['id', 'email', 'firstName', 'lastName']);

    const [access_token, refresh_token] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.jwtAccessExpireTime,
        secret: this.jwtAccessSecret,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: this.jwtRefreshExpireTime,
        secret: this.jwtRefreshSecret,
      }),
    ]);

    await this.databaseService.token.upsert({
      where: {
        userId: user.id,
      },
      update: {
        token: refresh_token,
      },
      create: {
        userId: user.id,
        token: refresh_token,
      },
    });

    return { access_token, refresh_token };
  }
}
