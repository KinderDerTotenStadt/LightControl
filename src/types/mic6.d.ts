declare module "mic6" {
  import { Readable } from "stream";

  interface MicrophoneOptions {
    endian?: "little" | "big";
    bitwidth?: number;
    encoding?: "signed-integer" | "unsigned-integer";
    rate?: number;
    channels?: number;
    device?: string;
    exitOnSilence?: number;
    debug?: boolean;
    fileType?: "raw" | "wav";
  }

  class Microphone {
    constructor(options?: MicrophoneOptions);
    public start(): void;
    public stop(): void;
    public resume(): void;
    public resume(): void;
    public getAudioStream(): Readable;

  }
  export = Microphone;
}