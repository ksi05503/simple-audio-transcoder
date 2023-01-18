import * as fs from 'fs';
import {PassThrough, Readable} from 'stream';
import * as child_process from 'child_process';
import {supportedOutputAudioFormats, TranscodeParams} from "./types";

export interface TranscodeResult {
    path: string;
}

async function handler(params: TranscodeParams) {
    const audioStream: Readable = fs.createReadStream(params.path);

    const result: TranscodeResult = await transcode({
        audio: audioStream,
        codec: params.codec,
        outputFormat: params.outputFormat,
        outputFileName:params.outputFileName,
        bitrate: params.bitrate,
        logProcess: params.logProcess,
    });

    console.debug(result);

}

function transcode(params: {
    audio: Readable,
    codec?: string,
    outputFormat: string,
    outputFileName: string,
    bitrate: number
    logProcess: boolean,
}): Promise<TranscodeResult> {
    console.debug(`aac transcode start ...`);

    const { audio, codec, outputFormat, outputFileName, bitrate } = params;

    const bitRateInString = `${Math.floor(bitrate / 1000)}k`;

    const outputPath = `../outputs/${outputFileName}.${outputFormat}`;

    const codecArgs: string[] = [];
    if(codec){
        assertValidCodec(codec);
        codecArgs.push('-c:a');
        codecArgs.push(codec);
    }
  
    return new Promise<TranscodeResult>((resolve, reject) => {
      const transcodeProcess = child_process.spawn("/ffmpeg", [
        '-i', 'pipe:0',
          ...codecArgs,
        '-b:a', bitRateInString,
          outputPath,
      ]);

      audio.pipe(transcodeProcess.stdin);

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
  
function assertValidCodec(codec: string): void{
    if(!supportedOutputAudioFormats.includes(codec)){
        throw Error(`unsupported codec: ${codec}\n required: [${supportedOutputAudioFormats.join(',')}]`)
    }
}

