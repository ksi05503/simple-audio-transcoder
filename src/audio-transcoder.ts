import * as fs from 'fs';
import * as path from 'path';
import * as child_process from 'child_process';
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
        const bitRateInString = `${Math.floor(bitrate / 1000)}k`;
        const outputPath = `${outDir}/${name}${outExtension || extension ? `.${outExtension || extension}` : ''}`;

        const args = this.buildArgs(bitRateInString, outputPath, codec);
        const audioStream: Readable = fs.createReadStream(path);

        return new Promise<TranscodeResult>((resolve, reject) => {
            const transcodeProcess = child_process.spawn(this.ffmpegPath, args);

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

    private buildArgs(bitRateInString: string, outputPath: string, codec?: string): string[] {
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

    private logProgress(childProcess: child_process.ChildProcessWithoutNullStreams): void {
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
