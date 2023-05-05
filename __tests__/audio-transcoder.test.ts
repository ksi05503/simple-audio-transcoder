// tests/AudioTranscoder.test.ts
import { AudioTranscoder } from '../src';
import { TranscodeResult } from '../@types/audio-transcoder';
import * as fs from 'fs';
import * as path from 'path';

describe('AudioTranscoder', () => {
    const ffmpegPath = path.join(__dirname, 'test-assets', 'ffmpeg');
    const transcoder = new AudioTranscoder(ffmpegPath);

    test('should transcode an audio file', async () => {
        const inputPath = path.join(__dirname, 'test-assets', 'input.mp3');
        const outputPath = path.join(__dirname, 'test-assets', '');

        const result: TranscodeResult = await transcoder.transcode(inputPath, {
            codec: 'aac',
            outExtension: 'm4a',
            bitrate: 128000,
            outDir: outputPath,
            logProgress: true,
        });

        expect(result).toHaveProperty('outputPath');
        expect(fs.existsSync(result.outputPath)).toBe(true);
        expect(result.outputPath).toMatch(/\.m4a$/);

        // Clean up output file after test
        fs.unlinkSync(result.outputPath);
    });
});
