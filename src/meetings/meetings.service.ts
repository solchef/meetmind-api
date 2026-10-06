import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateMeetingDto } from './dto/create-meeting.dto';
import { UpdateMeetingDto } from './dto/update-meeting.dto';

@Injectable()
export class MeetingsService {
  private readonly meeting;

  constructor(private readonly database: DatabaseService) {
    this.meeting = this.database.db.orm.public.Meeting;
  }

  async create(dto: CreateMeetingDto) {
    return this.meeting.create({
      title: dto.title,
      description: dto.description,
      workspaceId: dto.workspaceId,
      creatorId: dto.creatorId,
    });
  }

  async findAll() {
    return this.meeting.all();
  }

  async findOne(id: number) {
    const meeting = await this.meeting
      .where({ id })
      .first();

    if (!meeting) {
      throw new NotFoundException(`Meeting ${id} not found`);
    }

    return meeting;
  }

  async update(id: number, dto: UpdateMeetingDto) {
    await this.findOne(id);

    return this.meeting
      .where({ id })
      .update({
        ...dto,
      });
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.meeting
      .where({ id })
      .delete();
  }
}