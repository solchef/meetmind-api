import { Module } from '@nestjs/common';

import { TranscriptionModule } from '../transcription/transcription.module';
import { MeetingsController } from './meetings.controller';
import { MeetingsService } from './meetings.service';

@Module({
  imports: [TranscriptionModule],
  controllers: [MeetingsController],
  providers: [MeetingsService],
})
export class MeetingsModule {}