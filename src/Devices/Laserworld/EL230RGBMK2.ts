import GenericDevice from "@device/GenericDevice";
import { DMXSender } from "ArtNET";

export default class EL230RGBMK2 extends GenericDevice {
  private on: boolean = false;
  private dynamic: boolean = false;
  public color: number = 0;
  public spinColor: boolean = false;

  public constructor(dmx: DMXSender, address: number) {
    super(dmx, address, 9);
  }

  public setOn(on: boolean) {
    this.on = on;
    this.setChannel(0, this.on ? this.dynamic ? 200 : 150 : 0);
  }

  public setDynamic(dynamic: boolean) {
    this.dynamic = dynamic;
    this.setChannel(0, this.on ? this.dynamic ? 200 : 150 : 0);
  }

  public setPettern(pettern: number) {
    this.setChannel(1, pettern);
  }

  public setX(x: number) {
    this.setChannel(2, Math.min(Math.max(10, 10 + (x / 100 * 245)), 255));
  }

  public setY(y: number) {
    this.setChannel(3, Math.min(Math.max(10, 10 + (y / 100 * 245)), 255));
  }

  public setScanSpeed(speed: number) {
    this.setChannel(4, speed);
  }

  public setPetternSpeed(speed: number) {
    this.setChannel(5, speed);
  }

  public setZoom(zoom: number) {
    this.setChannel(6, zoom);
  }

  /**
   * Set the color of the laser
   * @param color range: 0 - 6
   */
  public setColor(color: number) {
    this.color = color % 7;
    this.setChannel(7, this.spinColor ? 0 : (2 + this.color * 2));
  }

  public setSpinColor(spinColor: boolean) {
    this.spinColor = spinColor;
    this.setChannel(7, this.spinColor ? 0 : (2 + this.color * 2));
  }

  public setColorSegment(colorSegment: number) {
    this.setChannel(8, colorSegment);
  }

}