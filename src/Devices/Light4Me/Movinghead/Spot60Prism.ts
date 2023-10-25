import GenericDevice from "@device/GenericDevice";
import { DMXSender } from "ArtNET";

export default class Spot60Prism extends GenericDevice {
  public color: number = 0;
  public dualColor: boolean = false;
  public spinColor: boolean = false;

  public constructor(dmx: DMXSender, address: number) {
    super(dmx, address, 9);
  }

  public setPan(x: number) {
    this.setChannel(0, Math.min(Math.max(0, x * 255 / 540), 255));
  }

  public setTilt(y: number) {
    this.setChannel(1, Math.min(Math.max(0, y * 255 / 280), 255));
  }

  public setPTSpeed(speed: number) {
    this.setChannel(2, speed);
  }

  public setStrobe(strobe: number) {
    this.setChannel(3, strobe);
  }

  public setDimmer(dimmer: number) {
    this.setChannel(4, dimmer);
  }

  public setColor(color: number) {
    this.color = color % 8;
    this.setChannel(5, this.spinColor ? 128 : (this.color * 16 + (this.dualColor ? 8 : 0)));
  }

  public setDualColor(dualColor: boolean) {
    this.dualColor = dualColor;
    this.setChannel(5, this.spinColor ? 128 : (this.color * 16 + (this.dualColor ? 8 : 0)));
  }

  public setSpinColor(spinColor: boolean) {
    this.spinColor = spinColor;
    this.setChannel(5, this.spinColor ? 128 : (this.color * 16 + (this.dualColor ? 8 : 0)));
  }

  public setGobo(gobo: number) {
    this.setChannel(6, gobo);
  }

  public setPrism(prism: boolean) {
    this.setChannel(7, prism ? 0 : 255);
  }

  public setPrismRotation(prismRotation: number) {
    this.setChannel(8, prismRotation);
  }

}