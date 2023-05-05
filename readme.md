# Simple Audio Transcoder

[Simple Audio Transcoder](https://www.npmjs.com/package/simple-audio-transcoder) is a Node.js package that provides a simple and easy-to-use API for transcoding audio files using FFmpeg.

## Installation
You can install Simple Audio Transcoder via npm:

```bash
npm install simple-audio-transcoder
```

Usage
To use Simple Audio Transcoder, you need to have FFmpeg installed on your system. You can download FFmpeg from the official website.

Here's an example of how to transcode an audio file:

```typescript
import { AudioTranscoder } from 'simple-audio-transcoder';

const ffmpegPath = '/path/to/ffmpeg'; // Update this with your local FFmpeg binary path
const transcoder = new AudioTranscoder(ffmpegPath);

const inputPath = '/path/to/input.mp3'; // Update this with your input audio file path
const outputPath = '/path/to/output.m4a'; // Update this with your output audio file path

await transcoder.transcode(inputPath, {
  codec: 'aac',  // optional
  outExtension: 'm4a',  // optional  
  bitrate: 128000,  // optional
  outDir: outputPath, // optional
  logProgress: true, // optional
});

console.log('Transcoding complete!');
```

## API
### AudioTranscoder
The 'AudioTranscoder' class is the main class of the Simple Audio Transcoder package. It provides the' transcode' method for transcoding audio files.

#### constructor(ffmpegPath: string)
Creates a new instance of the AudioTranscoder class.

- ffmpegPath: The path to the FFmpeg binary on your system.
async transcode(path: string, options: TranscodeParams): Promise<TranscodeResult>
Transcodes an audio file.

- path: The path to the input audio file.
- options: An object that specifies the transcoding options.
- codec: The output audio codec. Supported codecs: aac, m4a, mpeg, wav, mp3, mp4, webm, ogg.
- bitrate: The output audio bitrate. Default: 128000.
- outDir: The output directory. Default: ''.
- outExtension: The output file extension. Default: The same as the input file extension.
- logProgress: Whether to log the transcoding progress to the console. Default: false.

#### TranscodeParams
An interface that specifies the transcoding options.

- codec: The output audio codec. Supported codecs: aac, m4a, mpeg, wav, mp3, mp4, webm, ogg.
- bitrate: The output audio bitrate. Default: 128000.
- outDir: The output directory. Default: ''.
- outExtension: The output file extension. Default: The same as the input file extension.
- logProgress: Whether to log the transcoding progress to the console. Default: false.

#### TranscodeResult
An interface that specifies the result of a transcoding operation.

- outputPath: The path to the output audio file.

## License
#### Simple Audio Transcoder is released under the MIT License.
#### Copyright (c) 2023 by devyyeon
