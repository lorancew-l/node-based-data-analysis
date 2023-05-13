import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { ProjectModule } from './project/project.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), AuthModule, DatabaseModule, ProjectModule, UserModule],
  controllers: [UserController],
  providers: [UserService],
})
export class AppModule {}
