import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';
export class SaveProjectDto {
  @IsUUID()
  @IsOptional()
  id?: string;

  @IsNotEmpty()
  data: any;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString()
  description?: string;

  @IsBoolean()
  published?: boolean;
}

export class SearchProjectsDto {
  @IsInt()
  @Type(() => Number)
  @Min(1)
  @IsNotEmpty()
  page: number;

  @IsInt()
  @Type(() => Number)
  @IsNotEmpty()
  offset: number;

  @IsString()
  @IsOptional()
  user?: string;

  @IsString()
  @IsOptional()
  search?: string;
}
