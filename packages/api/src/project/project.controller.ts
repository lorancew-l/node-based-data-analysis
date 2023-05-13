import { Controller, Post, Get, Body, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { SaveProjectDto, SearchPublicProjectsDto, SearchUserProjectsDto } from './dto';
import { GetUserId } from 'src/auth/decorators';
import { AccessGuard } from 'src/auth/guards';
import { ProjectService } from './project.service';
import { ProjectAccessDenied } from './exceptions';

@Controller('project')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @UseGuards(AccessGuard)
  @Post('save')
  saveProject(@GetUserId() userId: string, @Body() project: SaveProjectDto) {
    return this.projectService.saveProject(userId, project);
  }

  @UseGuards(AccessGuard)
  @Post('clone')
  async cloneProject(@GetUserId() userId: string, @Body('projectId') projectId: string) {
    try {
      return await this.projectService.cloneProject(userId, projectId);
    } catch (error) {
      if (error instanceof ProjectAccessDenied) {
        throw new ForbiddenException();
      }

      throw error;
    }
  }

  @UseGuards(AccessGuard)
  @Post('remove')
  async removeProject(@GetUserId() userId: string, @Body('projectIdList') projectIdList: string[]) {
    return await this.projectService.removeProject(userId, projectIdList);
  }

  @UseGuards(AccessGuard)
  @Get('get')
  async getProject(@GetUserId() userId: string, @Query('projectId') projectId: string) {
    try {
      return await this.projectService.getProject(userId, projectId);
    } catch (error) {
      if (error instanceof ProjectAccessDenied) {
        throw new ForbiddenException();
      }
    }
  }

  @UseGuards(AccessGuard)
  @Get('public-projects')
  async searchPublicProjects(@Query() query: SearchPublicProjectsDto) {
    return await this.projectService.searchPublicProjects(query);
  }

  @UseGuards(AccessGuard)
  @Get('user-projects')
  async searchUserProjects(@GetUserId() userId: string, @Query() query: SearchUserProjectsDto) {
    return await this.projectService.searchUserProjects(userId, query);
  }
}
