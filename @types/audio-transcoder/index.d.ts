export type SupportedAudioExtension =
    | 'aac'
    | 'm4a'
    | 'mpeg'
    | 'wav'
    | 'mp3'
    | 'mp4'
    | 'webm'
    | 'ogg';

export type TranscodeParams = {
    codec?: string;
    bitrate?: number;
    outDir?: string;
    outExtension?: SupportedAudioExtension;
    logProgress?: boolean;
}

export interface TranscodeResult {
    outputPath: string;
}
