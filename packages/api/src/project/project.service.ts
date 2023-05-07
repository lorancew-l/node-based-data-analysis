import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { SaveProjectDto, SearchProjectsDto } from './dto';
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

  async searchProjects({ page, offset, user, search }: SearchProjectsDto) {
    const where = {
      published: true,
    };

    const [count, projects] = await this.databaseService.$transaction([
      this.databaseService.project.count({ where }),
      this.databaseService.project.findMany({
        skip: offset * (page - 1),
        take: offset,
        select: {
          id: true,
          title: true,
          description: true,
          created_at: true,
          updated_at: true,
          user: {
            select: {
              email: true,
              firstName: true,
              id: true,
              lastName: true,
            },
          },
        },
        where,
        orderBy: {
          updated_at: 'desc',
        },
      }),
    ]);

    return { count, page, offset, items: projects };
  }
}
