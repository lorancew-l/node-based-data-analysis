import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Query,
  UseGuards,
  ForbiddenException,
  BadRequestException,
  Param,
  HttpStatus,
} from '@nestjs/common';
import { ProjectDto, SaveProjectDto, SearchProjectsDto, UpdateProjectDto } from './dto';
import { GetUserId } from 'src/auth/decorators';
import { AccessGuard } from 'src/auth/guards';
import { ProjectService } from './project.service';
import { MissingParameter, ProjectAccessDenied } from './exceptions';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery, ApiBody } from '@nestjs/swagger';

@ApiTags('Projects')
@Controller('projects')
export class ProjectController {
  constructor(private projectService: ProjectService) {}

  @ApiOperation({ summary: 'Searches projects with specified filters' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ProjectDto, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @UseGuards(AccessGuard)
  @Get()
  async searchPublicProjects(@GetUserId() userId: string, @Query() query: SearchProjectsDto) {
    try {
      return await this.projectService.searchProjects(userId, query);
    } catch (error) {
      if (error instanceof ProjectAccessDenied) {
        throw new ForbiddenException(error.message);
      }

      if (error instanceof MissingParameter) {
        throw new BadRequestException(error.message);
      }
    }
  }

  @ApiOperation({ summary: 'Saves or clones given project' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ProjectDto, isArray: true })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @ApiQuery({ name: 'sourceId', required: false, type: 'string' })
  @ApiBody({ required: false, type: SaveProjectDto })
  @UseGuards(AccessGuard)
  @Post()
  async saveProject(@GetUserId() userId: string, @Query('sourceId') sourceId?: string, @Body() project?: SaveProjectDto) {
    if (!project && !sourceId) {
      throw new BadRequestException('Missing sourceId');
    }

    if (sourceId) {
      try {
        return await this.projectService.cloneProject(userId, sourceId);
      } catch (error) {
        if (error instanceof ProjectAccessDenied) {
          throw new ForbiddenException();
        }

        throw error;
      }
    }

    return this.projectService.saveProject(userId, project);
  }

  @ApiOperation({ summary: 'Gets the project by the given id' })
  @ApiParam({ name: 'projectId', required: true, description: 'Project identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ProjectDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @UseGuards(AccessGuard)
  @Get(':projectId')
  async getProject(@GetUserId() userId: string, @Param('projectId') projectId: string) {
    try {
      return await this.projectService.getProject(userId, projectId);
    } catch (error) {
      if (error instanceof ProjectAccessDenied) {
        throw new ForbiddenException();
      }
    }
  }

  @ApiOperation({ summary: 'Updates the project by the given id' })
  @ApiParam({ name: 'projectId', required: true, description: 'Project identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ProjectDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @UseGuards(AccessGuard)
  @Patch(':projectId')
  async updateProject(@GetUserId() userId: string, @Param('projectId') projectId: string, @Body() project: UpdateProjectDto) {
    return this.projectService.saveProject(userId, project, projectId);
  }

  @ApiOperation({ summary: 'Deletes the project by the given id list' })
  @ApiParam({ name: 'projectId', required: true, description: 'Project identifier' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Success', type: ProjectDto })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden' })
  @UseGuards(AccessGuard)
  @Delete(':projectId')
  async removeProject(@GetUserId() userId: string, @Param('projectId') projectId: string) {
    try {
      const projectIdList = projectId.split(',');
      return await this.projectService.removeProject(userId, projectIdList);
    } catch (error) {
      if (error instanceof ProjectAccessDenied) {
        throw new ForbiddenException();
      }
    }
  }
}
