import { Injectable } from '@nestjs/common';
import Groq from 'groq-sdk';
import { createReadStream } from 'node:fs';

export interface TranscriptionSegment {
  start: number;
  end: number;
  text: string;
}

export interface TranscriptionResult {
  text: string;
  segments: TranscriptionSegment[];
}

@Injectable()
export class TranscriptionService {
  private readonly groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  async transcribe(
    filePath: string,
  ): Promise<TranscriptionResult> {
    const transcription =
      await this.groq.audio.transcriptions.create({
        file: createReadStream(filePath),
        model: 'whisper-large-v3-turbo',
        response_format: 'verbose_json',
        timestamp_granularities: ['segment'],
        language: 'en',
        temperature: 0,
      });

    return transcription as unknown as TranscriptionResult;
  }
}