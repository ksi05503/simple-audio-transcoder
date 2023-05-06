import * as fs from 'fs';
import * as path from 'path';
import * as childProcess from 'child_process';
import { Readable } from 'stream';
import { TranscodeParams, TranscodeResult } from "../@types/audio-transcoder";

export class AudioTranscoder {
    constructor(private readonly ffmpegPath: string) {
        this.ffmpegPath = ffmpegPath;
    }

    async transcode(path: string, {
        codec,
        outExtension,
        bitrate = 128000,
        outDir = '',
        logProgress = false
    }: TranscodeParams): Promise<TranscodeResult> {
        const { name, extension } = this.parseFileName(path);
        const outputPath = `${outDir}/${name}${outExtension || extension ? `.${outExtension || extension}` : ''}`;

        const args = this.buildArgs(bitrate, outputPath, codec);
        const audioStream: Readable = fs.createReadStream(path);

        return new Promise<TranscodeResult>((resolve, reject) => {
            const transcodeProcess = childProcess.spawn(this.ffmpegPath, args);

            audioStream.pipe(transcodeProcess.stdin);

            if (logProgress) {
                this.logProgress(transcodeProcess);
            }

            transcodeProcess.on('error', (err: Error) => {
                reject(err);
            });

            transcodeProcess.on('close', () => {
                resolve({ outputPath: outputPath });
            });
        });
    }

    private buildArgs(bitrate: number, outputPath: string, codec?: string): string[] {
        const bitRateInString = `${Math.floor(bitrate / 1000)}k`;

        const codecArgs: string[] = [];
        if (codec) {
            codecArgs.push('-c:a', codec);
        }
        return [
            '-i', 'pipe:0',
            ...codecArgs,
            '-b:a', bitRateInString,
            outputPath,
        ];
    }

    private parseFileName(filePath: string): { name: string, extension?: string } {
        const fileName = path.basename(filePath);
        const splits = fileName.split('.');

        if (fileName === '') throw new Error('File path should not be empty.');
        if (splits.length > 2) throw new Error('Invalid File Name. File name should not contain more than one dot.');

        const [name, extension] = splits;

        return { name, extension };
    }

    private logProgress(childProcess: childProcess.ChildProcessWithoutNullStreams): void {
        let scriptOutput = '';

        childProcess.stdout.setEncoding('utf8');
        childProcess.stdout.on('data', (data) => {
            console.log('stdout: ' + data);
            data = data.toString();
            scriptOutput += data;
        });

        childProcess.stderr.on('data', (data) => {
            console.log('stderr: ' + data);
            data = data.toString();
            scriptOutput += data;
        });
    }
}
