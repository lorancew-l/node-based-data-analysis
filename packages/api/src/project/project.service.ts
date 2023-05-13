import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { omit } from 'lodash';
import { DatabaseService } from 'src/database/database.service';
import { SaveProjectDto, SearchPublicProjectsDto, SearchUserProjectsDto } from './dto';
import { ProjectAccessDenied } from './exceptions';

@Injectable()
export class ProjectService {
  constructor(private databaseService: DatabaseService) {}

  async saveProject(userId: string, project: SaveProjectDto) {
    const { userId: projectUserId } = (await this.databaseService.project.findFirst({ where: { id: project.id } })) ?? {};

    if (projectUserId && userId !== projectUserId) {
      throw new ProjectAccessDenied();
    }

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

  async searchPublicProjects({ page, offset, user, search }: SearchPublicProjectsDto) {
    const where: Prisma.ProjectWhereInput = {
      AND: [
        {
          published: true,
        },
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        ...(user ? [{ userId: user }] : []),
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

  async searchUserProjects(userId: string, { page, offset, search }: SearchUserProjectsDto) {
    const where: Prisma.ProjectWhereInput = {
      AND: [
        {
          title: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          userId,
        },
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
