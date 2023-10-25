import GenericDevice from "@device/GenericDevice";
import { DMXSender } from "ArtNET";

export default class GenericRGBDimmerDevice extends GenericDevice {
  public constructor(dmx: DMXSender, address: number) {
    super(dmx, address, 4);
  }

  public setDimmer(dimmer: number) {
    this.setChannel(0, dimmer);
  }

  public setColor(r: number, g: number, b: number) {
    this.setChannel(1, r);
    this.setChannel(2, g);
    this.setChannel(3, b);
  }
}