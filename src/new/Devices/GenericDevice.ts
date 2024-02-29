import { ChannelOutOfSizeError } from '@error/ChannelOutOfSizeError';
import { DMXSender } from 'ArtNET';

export default class GenericDevice {
  public Address;
  public Size;
  public DMX;

  public constructor(dmx: DMXSender, address: number, size: number) {
    this.DMX = dmx;
    this.Address = address;
    this.Size = size;
    for (let index = 0; index < size; index++)
      this.DMX.prepChannel(this.Address + index, 0);
    this.DMX.transmit();
  }

  public setChannel(channel: number, value: number) {
    if (channel >= this.Size) throw new ChannelOutOfSizeError(channel, this.Size);
    this.DMX.prepChannel(this.Address + channel, value);
    this.DMX.transmit();
  }
}