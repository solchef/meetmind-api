import { IsOptional, IsString } from 'class-validator';

export class UpdateMeetingDto {
  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}