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
    bitrate: number;
    codec?: string;
    outDir?: string;
    outExtension?: SupportedAudioExtension;
    logProgress?: boolean;
}

export interface TranscodeResult {
    outputPath: string;
}
