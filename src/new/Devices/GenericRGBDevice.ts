import GenericDevice from "@device/GenericDevice";
import { DMXSender } from "ArtNET";

export default class GenericRGBDevice extends GenericDevice {
  public constructor(dmx: DMXSender, address: number) {
    super(dmx, address, 3);
  }

  public setColor(r: number, g: number, b: number) {
    this.setChannel(0, r);
    this.setChannel(1, g);
    this.setChannel(2, b);
  }
}