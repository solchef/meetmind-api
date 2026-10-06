import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MeetingsService } from './meetings.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

@Controller('meetings')
@UseGuards(JwtAuthGuard)
export class MeetingsController {
  constructor(private readonly meetingsService: MeetingsService) {}

  @Post()
  create(
    @Body() dto: CreateMeetingDto,
    @Req() req: AuthenticatedRequest,
  ) {
    return this.meetingsService.create(dto, req.user.id);
  }

@Get()
findAll(@Req() req: AuthenticatedRequest) {
  return this.meetingsService.findAll(req.user.id);
}

@Get(':id')
findOne(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthenticatedRequest,
) {
  return this.meetingsService.findOne(id, req.user.id);
}

@Patch(':id')
update(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: UpdateMeetingDto,
  @Req() req: AuthenticatedRequest,
) {
  return this.meetingsService.update(id, dto, req.user.id);
}

@Delete(':id')
remove(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthenticatedRequest,
) {
  return this.meetingsService.remove(id, req.user.id);
}
@Post(':id/start')
start(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthenticatedRequest,
) {
  return this.meetingsService.start(id, req.user.id);
}

@Post(':id/end')
end(
  @Param('id', ParseIntPipe) id: number,
  @Req() req: AuthenticatedRequest,
) {
  return this.meetingsService.end(id, req.user.id);
}

@Post(':id/audio')
@UseInterceptors(
  FileInterceptor('file', {
    limits: {
      fileSize: 100 * 1024 * 1024,
    },
  }),
)
uploadAudio(
  @Param('id', ParseIntPipe) id: number,
  @UploadedFile() file: {
  fieldname: string;
  originalname: string;
  encoding: string;
  mimetype: string;
  size: number;
  destination: string;
  filename: string;
  path: string;
  buffer: Buffer;
},
  @Req() req: AuthenticatedRequest,
) {
  return this.meetingsService.uploadAudio(
    id,
    file,
    req.user.id,
  );
}

}

