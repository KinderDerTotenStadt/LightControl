import GenericDevice from "@device/GenericDevice";
import { DMXSender } from "ArtNET";
import Color from "Objects/Color";
import Device from "new/Device";
import Project from "new/Project";

export default class Spot60Prism extends Device {
  public type = "Light4Me/Movinghead/Spot60Prism";
  public color: number;
  public pan: number;
  public tilt: number;
  public ptSpeed: number;
  public strobe: boolean;
  public dimmer: number;
  public dualColor: boolean;
  public spinColor: boolean;
  public gobo: number;
  public prism: boolean;
  public prismRotation: number;

  public constructor(project: Project, address: string) {
    super(project, address);
    this.color = 0;
    this.pan = 200;
    this.tilt = 60;
    this.ptSpeed = 0;
    this.strobe = false;
    this.dimmer = 255;
    this.dualColor = false;
    this.spinColor = false;
    this.gobo = 0;
    this.prism = false;
    this.prismRotation = 0;
  }
}