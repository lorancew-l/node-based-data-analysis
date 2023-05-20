import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { Project } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class SaveProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsOptional()
  data: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  title: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  published?: boolean;
}

export class UpdateProjectDto {
  @ApiProperty()
  @IsNotEmpty()
  data: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description?: string;

  @ApiProperty()
  @IsBoolean()
  published?: boolean;
}

export class SearchProjectsDto {
  @ApiProperty({ required: true })
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  page: number;

  @ApiProperty({ required: true })
  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  offset: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  user?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true')
  published?: boolean;
}

export class ProjectDto implements Project {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  data: any;

  @ApiProperty()
  description: string;

  @ApiProperty()
  published: boolean;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty()
  userId: string;
}
