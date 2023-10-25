import { Transform } from "stream";

export default class Gain extends Transform {
  constructor(options: GainOptions) {
    super({
      transform: (chunk, encoding, callback) => {
        let output = Buffer.alloc(chunk.length);
        let data;
        for (let i = 0; i < chunk.length; i += 4) {
          data = chunk.readInt16LE(i);
          output.writeInt16LE(data * options.gain, i);
          data = chunk.readInt16LE(i);
          output.writeInt16LE(data * options.gain, i + 2);
        }
        this.push(output);
        callback();
      }
    });
  }
}

interface GainOptions {
  gain: number;
  channels: number;
  sampleRate: number;
  bitDepth: number;
}