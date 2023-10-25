import { Readable, ReadableOptions } from 'stream';
import mic = require('mic6');
// audioProcessOptions
//        \/
// { ...audioProcessOptions, env: { AUDIODEV: options.device ?? 'default' } })

export default class Microphone extends Readable {
  private mic: mic;

  public constructor(options: MicrophoneOptions) {
    super({});
    this.mic = new mic({
      rate: options.sampleRate || 44100,
      channels: options.channels || 1,
      bitwidth: options.bitDepth || 16,
      device: options.device
    });
    this.wrap(this.mic.getAudioStream());
    this.mic.start();
  }

  close() {
    this.mic.stop();
    this.emit('close');
  }
}

export interface MicrophoneOptions extends ReadableOptions {
  readonly channels?: number;
  readonly bitDepth?: number;
  readonly sampleRate?: number;
  readonly lowWaterMark?: number;
  readonly highWaterMark?: number;
  readonly device?: string;
}