import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

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
