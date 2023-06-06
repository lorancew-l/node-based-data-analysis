import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { omit } from 'lodash';
import { DatabaseService } from 'src/database/database.service';
import { SaveProjectDto, SearchProjectsDto } from './dto';
import { MissingParameter, ProjectAccessDenied } from './exceptions';
import { resolve } from 'path';

@Injectable()
export class ProjectService {
  constructor(private databaseService: DatabaseService) {}

  async saveProject(userId: string, project: SaveProjectDto, projectId?: string) {
    const currentProject = !projectId ? null : await this.databaseService.project.findFirst({ where: { id: projectId } });

    const { userId: projectUserId } = currentProject ?? {};

    if (projectUserId && userId !== projectUserId) {
      throw new ProjectAccessDenied();
    }

    return this.databaseService.project.upsert({
      where: {
        id: projectId ?? 'none',
      },
      update: {
        ...currentProject,
        ...project,
      },
      create: {
        ...project,
        userId,
      },
    });
  }

  async getProject(userId: string, projectId: string) {
    const project = await this.databaseService.project.findUnique({ where: { id: projectId } });

    if (!project) {
      return null;
    }

    if (!project.published && project.userId !== userId) {
      throw new ProjectAccessDenied();
    }

    return project;
  }

  async cloneProject(userId: string, projectId: string) {
    const project = await this.getProject(userId, projectId);

    return this.saveProject(userId, { ...omit(project, 'id'), title: `(Клон) ${project.title}` });
  }

  async removeProject(userId: string, projectIdList: string[]) {
    const userIdList = await this.databaseService.project.findMany({
      where: { id: { in: projectIdList } },
      select: { id: true },
    });

    if (!userIdList.some(({ id }) => id !== userId)) {
      throw new ProjectAccessDenied();
    }

    return await this.databaseService.project.deleteMany({
      where: {
        AND: [
          {
            id: {
              in: projectIdList,
            },
          },
          {
            userId,
          },
        ],
      },
    });
  }

  async searchProjects(userId: string, { page, offset, user, search, published = true }: SearchProjectsDto) {
    if (!published && !user) {
      throw new MissingParameter('user');
    }

    if (!published && user && user !== userId) {
      throw new ProjectAccessDenied();
    }

    const where: Prisma.ProjectWhereInput = {
      AND: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        ...(user ? [{ userId: user }] : []),
        ...(published
          ? [
              {
                published: true,
              },
            ]
          : []),
      ],
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
