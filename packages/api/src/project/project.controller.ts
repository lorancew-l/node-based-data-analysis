import { Controller, Post, Get, Body, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { SaveProjectDto } from './dto';
import { GetUserId } from 'src/auth/decorators';
import { AccessGuard } from 'src/auth/guards';
import { ProjectService } from './project.service';
import { ProjectAccessDenied } from './exceptions';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessGuard)
  @Post('save')
  saveProject(@Body() project: SaveProjectDto, @GetUserId() userId: string) {
    return this.projectService.saveProject(project, userId);
  }

  @UseGuards(AccessGuard)
  @Get('get')
  async getProject(@Query('projectId') projectId: string, @GetUserId() userId: string) {
    try {
      return await this.projectService.getProject(projectId, userId);
    } catch (error) {
      if (error instanceof ProjectAccessDenied) {
        return new ForbiddenException();
      }
    }
  }
}
