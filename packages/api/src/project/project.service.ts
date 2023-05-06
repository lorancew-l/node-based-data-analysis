import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SaveProjectDto } from './dto';
import { ProjectAccessDenied } from './exceptions';

@Injectable()
export class ProjectService {
  constructor(private databaseService: DatabaseService) {}

  async saveProject(project: SaveProjectDto, userId: string) {
    return this.databaseService.project.upsert({
      where: {
        id: project.id ?? 'none',
      },
      update: {
        ...project,
      },
      create: {
        ...project,
        userId,
      },
    });
  }

  async getProject(projectId: string, userId: string) {
    const project = await this.databaseService.project.findUnique({ where: { id: projectId } });

    if (!project) {
      return null;
    }

    if (!project.published && project.userId !== userId) {
      throw new ProjectAccessDenied();
    }

    return project;
  }
}
