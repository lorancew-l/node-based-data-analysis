import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { DatabaseModule } from 'src/database/database.module';
import { ProjectController } from './project.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
