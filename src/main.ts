import * as fs from 'fs';
import { Readable } from 'stream';
import * as child_process from 'child_process';
import { supportedOutputAudioFormats, TranscodeParams, TranscodeResult } from "./types";

async function handler(params: TranscodeParams) {
    const audioStream: Readable = fs.createReadStream(params.path);

    const result: TranscodeResult = await transcode({
        audio: audioStream,
        codec: params.codec,
        outputFormat: params.outputFormat,
        outputFileName:params.outputFileName,
        bitrate: params.bitrate,
        debugProgress: params.debugProgress,
    });

    console.debug(result);
}

function transcode(params: {
    audio: Readable,
    codec?: string,
    outputFormat: string,
    outputFileName: string,
    bitrate: number
    debugProgress: boolean,
}): Promise<TranscodeResult> {
    console.debug(`aac transcode start ...`);

    const { audio, codec, outputFormat, outputFileName, bitrate, debugProgress } = params;

    const bitRateInString = `${Math.floor(bitrate / 1000)}k`;

    const outputPath = `/outputs/${outputFileName}.${outputFormat}`;

    const codecArgs: string[] = [];
    if(codec){
        assertValidCodec(codec);
        codecArgs.push('-c:a');
        codecArgs.push(codec);
    }

    return new Promise<TranscodeResult>((resolve, reject) => {
      const transcodeProcess = child_process.spawn("ffmpeg", [
        '-i', 'pipe:0',
          ...codecArgs,
        '-b:a', bitRateInString,
          outputPath,
      ]);


      audio.pipe(transcodeProcess.stdin);

      if(debugProgress){
          logProgress(transcodeProcess);
      }


      transcodeProcess.on('err', (err: Error) => {
        console.error(err);
        reject(err);
      });
  
      transcodeProcess.on('close', () => {
        console.debug('... transcode process done')
        resolve({
          path: outputPath,
        });
      });
    });
}
  
function assertValidCodec(codec: string): void {
    if(!supportedOutputAudioFormats.includes(codec)){
        throw Error(`unsupported codec: ${codec}\n required: [${supportedOutputAudioFormats.join(',')}]`)
    }
}

function logProgress(childProcess: child_process.ChildProcessWithoutNullStreams): void {
    let scriptOutput = '';
    childProcess.stdout.setEncoding('utf8');
    childProcess.stdout.on('data', function (data) {
        console.log('stdout: ' + data);
        data = data.toString();
        scriptOutput += data;
    });
    childProcess.stderr.on('data', function (data) {
        console.log('stderr: ' + data);
        data = data.toString();
        scriptOutput += data;
    });
}
