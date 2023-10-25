import { Transform } from 'stream';
import { FirFilter as Filter, FirCoeffs as Coefficients } from 'fili';
import SlidingWindowMax = require('sliding-window-max');

const FREQ = 44100
const SAMPLES_WINDOW = FREQ * 1.5
const MIN_PEAK_DISTANCE = FREQ / 5
const MAX_INT16 = Math.pow(2, 16) / 2 - 1
const MAX_UINT32 = Math.pow(2, 32) - 1

export default class BeatDetector extends Transform {
  private leftFilter: Filter;
  private lastPeakDistance: number;
  private slidingWindowMax: SlidingWindowMax;
  public readonly frequency: number;
  public readonly sensitivity: number;
  public readonly minThreashold: number;

  public constructor(options: BeatDetectorOptions) {
    super({
      transform: (chunk, encoding, callback) => {
        this.analyze(chunk);
        callback();
      }
    });
    this.frequency = options.frequency || FREQ;
    this.sensitivity = options.sensitivity || 0.6;
    this.minThreashold = options.minThreashold || MAX_INT16 * 0.05;
    this.lastPeakDistance = MAX_UINT32;
    this.slidingWindowMax = new SlidingWindowMax(SAMPLES_WINDOW, { waitFullRange: false });
    this.leftFilter = new Filter(new Coefficients().lowpass({
      order: 750,
      Fs: this.frequency,
      Fc: 100,
    }));
  }

  private analyze(buffer: Buffer): void {
    let debugBuffer = Buffer.alloc(buffer.length);
    for (let i = 0; i < buffer.length; i += 4) {
      const left = buffer.readInt16LE(i);
      const filteredLeft = this.leftFilter.singleStep(left);
      let threshold = Math.max(this.slidingWindowMax.add(filteredLeft) * this.sensitivity, this.minThreashold);
      let overThreshold = filteredLeft >= threshold;
      let enoughTimeSinceLastPeak = this.lastPeakDistance > MIN_PEAK_DISTANCE;
      if (overThreshold && enoughTimeSinceLastPeak) {
        this.lastPeakDistance = 0;
        this.emit('peak-detected');
      }
      this.lastPeakDistance++;
      if (this.lastPeakDistance > MAX_UINT32) this.lastPeakDistance = MAX_UINT32;
      // debugBuffer.writeInt16LE(overThreshold ? MAX_INT16 : 0, i);
      // debugBuffer.writeInt16LE(overThreshold ? MAX_INT16 : 0, i + 2);
      // debugBuffer.writeInt16LE(Math.min(filteredLeft), i);
      // debugBuffer.writeInt16LE(filteredLeft, i + 2);
    }
    this.push(buffer);
  }
}

export interface BeatDetectorOptions {
  frequency?: number;
  sensitivity?: number;
  minThreashold?: number;
}