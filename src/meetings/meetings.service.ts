import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { mkdir, rename } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto'; import { DatabaseService } from '../database/database.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';
import { TranscriptionService } from '../transcription/transcription.service';


@Injectable()
export class MeetingsService {
  private readonly meeting;
  private readonly workspaceMember;

  constructor(
    private readonly database: DatabaseService,
    private readonly transcriptionService: TranscriptionService,
) {
    this.meeting = this.database.db.orm.public.Meeting;
    this.workspaceMember = this.database.db.orm.public.WorkspaceMember;
  }

  private async ensureWorkspaceMember(
    workspaceId: number,
    userId: number,
  ) {
    const membership = await this.workspaceMember
      .where({
        workspaceId,
        userId,
      })
      .first();

    if (!membership) {
      throw new ForbiddenException(
        'You are not a member of this workspace',
      );
    }
  }

  async create(dto: CreateMeetingDto, creatorId: number) {
    await this.ensureWorkspaceMember(dto.workspaceId, creatorId);

    return this.meeting.create({
      title: dto.title,
      description: dto.description,
      workspaceId: dto.workspaceId,
      creatorId,
    });
  }

  async findAll(userId: number) {
    const memberships = await this.workspaceMember
      .where({ userId })
      .all();

    if (memberships.length === 0) {
      return [];
    }

    const meetings = [];

    for (const membership of memberships) {
      const workspaceMeetings = await this.meeting
        .where({
          workspaceId: membership.workspaceId,
        })
        .all();

      meetings.push(...workspaceMeetings);
    }

    return meetings;
  }

  async findOne(id: number, userId: number) {
    const meeting = await this.meeting
      .where({ id })
      .first();

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    await this.ensureWorkspaceMember(meeting.workspaceId, userId);

    return meeting;
  }

  async update(id: number, dto: UpdateMeetingDto, userId: number) {
    const meeting = await this.findOne(id, userId);

    return this.meeting
      .where({ id: meeting.id })
      .update({
        ...dto,
      });
  }

  async remove(id: number, userId: number) {
    const meeting = await this.findOne(id, userId);

    return this.meeting
      .where({ id: meeting.id })
      .delete();
  }

  async start(id: number, userId: number) {
    const meeting = await this.findOne(id, userId);

    if (meeting.status !== 'SCHEDULED') {
      throw new ForbiddenException(
        `Meeting cannot be started from ${meeting.status} status`,
      );
    }

    return this.meeting
      .where({ id })
      .update({
        startedAt: new Date().toISOString(),
      });
  }

  async end(id: number, userId: number) {
    const meeting = await this.findOne(id, userId);

    if (meeting.status !== 'SCHEDULED') {
      throw new ForbiddenException(
        `Meeting cannot be ended from ${meeting.status} status`,
      );
    }

    if (!meeting.startedAt) {
      throw new ForbiddenException(
        'Meeting has not been started',
      );
    }

    return this.meeting
      .where({ id })
      .update({
        endedAt: new Date().toISOString(),
        status: 'UPLOADING',
      });
  }

  async uploadAudio(
    id: number,
    file: {
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
    userId: number,
  ) {
    const meeting = await this.findOne(id, userId);

    if (!file) {
      throw new BadRequestException('Audio file is required');
    }

    if (meeting.status !== 'UPLOADING') {
      throw new ConflictException(
        `Audio cannot be uploaded while meeting is ${meeting.status}`,
      );
    }

    const allowedTypes = [
      'audio/mpeg',
      'audio/mp4',
      'audio/wav',
      'audio/x-wav',
      'audio/webm',
      'audio/ogg',
      'audio/x-m4a',
    ];

    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        'Unsupported audio format',
      );
    }

    const uploadDir = join(
      process.cwd(),
      'uploads',
      'meetings',
    );

    await mkdir(uploadDir, { recursive: true });

    const extension =
      file.originalname.split('.').pop() || 'audio';

    const filename = `${randomUUID()}.${extension}`;
    const destination = join(uploadDir, filename);

    await rename(file.path, destination);

    const audioUrl = `/uploads/meetings/${filename}`;

    return this.meeting
      .where({ id })
      .update({
        audioUrl,
        status: 'PROCESSING',
      });
  }

async transcribe(id: number, userId: number) {
  const meeting = await this.findOne(id, userId);

  if (!meeting.audioUrl) {
    throw new BadRequestException(
      'Meeting does not have an audio file',
    );
  }

  const filePath = join(
    process.cwd(),
    meeting.audioUrl.replace(/^\//, ''),
  );

  const transcription =
    await this.transcriptionService.transcribe(filePath);

  const transcriptSegment =
    this.database.db.orm.public.TranscriptSegment;

  // Remove existing transcript segments so the operation
  // can safely be retried.
  await transcriptSegment
    .where({ meetingId: id })
    .deleteAll();

  const segments = transcription.segments ?? [];

  for (const segment of segments) {
    await transcriptSegment.create({
      meetingId: id,
      startTimeMs: Math.round(segment.start * 1000),
      endTimeMs: Math.round(segment.end * 1000),
      text: segment.text.trim(),
    });
  }

  return {
    meetingId: id,
    segmentCount: segments.length,
    status: 'saved',
  };
}

async getTranscript(id: number, userId: number) {
  await this.findOne(id, userId);

  const transcriptSegment =
    this.database.db.orm.public.TranscriptSegment;

const segments = await transcriptSegment
  .where({ meetingId: id })
  .all();

return segments.sort(
  (a, b) => a.startTimeMs - b.startTimeMs,
);
}

}