export class ChannelOutOfSizeError extends Error {
  constructor(channel: number, size: number) {
    super(`The channel ${channel} is out of the device chennel size ${size}`);
  }
}