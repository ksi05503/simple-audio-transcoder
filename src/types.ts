export const supportedOutputAudioFormats: string[] = ['aac', 'm4a', 'mpeg', 'wav', 'mp3', 'mp4', 'webm', 'ogg']

export interface TranscodeParams {
    path: string,
    bitrate: number,
    outputFormat: string,
    outputFileName: string,
    debugProgress: boolean,
    codec?: string,
}


export interface TranscodeResult {
    path: string;
}




