import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DatabaseService } from '../database/database.service';
import { AddMemberDto } from './dto/add-member.dto';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@Injectable()
export class WorkspacesService {
  private readonly workspace;
  private readonly workspaceMember;
  private readonly user;

  constructor(private readonly database: DatabaseService) {
    this.workspace = this.database.db.orm.public.Workspace;
    this.workspaceMember = this.database.db.orm.public.WorkspaceMember;
    this.user = this.database.db.orm.public.User;
  }

  async create(dto: CreateWorkspaceDto, userId: number) {
    const workspace = await this.workspace.create({
      name: dto.name,
    });

    await this.workspaceMember.create({
      workspaceId: workspace.id,
      userId,
    });

    return workspace;
  }

  async findAll(userId: number) {
    const memberships = await this.workspaceMember
      .where({ userId })
      .all();

    const workspaces = [];

    for (const membership of memberships) {
      const workspace = await this.workspace
        .where({ id: membership.workspaceId })
        .first();

      if (workspace) {
        workspaces.push(workspace);
      }
    }

    return workspaces;
  }

  async findOne(id: number, userId: number) {
    await this.ensureMember(id, userId);

    const workspace = await this.workspace
      .where({ id })
      .first();

    if (!workspace) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }

    return workspace;
  }

  async addMember(
    workspaceId: number,
    dto: AddMemberDto,
    userId: number,
  ) {
    await this.ensureMember(workspaceId, userId);

    const user = await this.user
      .where({ email: dto.email })
      .first();

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const existingMembership = await this.workspaceMember
      .where({
        workspaceId,
        userId: user.id,
      })
      .first();

    if (existingMembership) {
      throw new ConflictException(
        'User is already a member of this workspace',
      );
    }

    return this.workspaceMember.create({
      workspaceId,
      userId: user.id,
    });
  }

  private async ensureMember(workspaceId: number, userId: number) {
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
}