
import { DMXSender } from "ArtNET";
import Color from "Objects/Color";
import Device from "new/Device";
import Project from "new/Project";

export default class LedFloodPanel150RGB8Channel extends Device {
  color: Color;
  strobe: number;
  dimmer: number;

  public constructor(project: Project, address: string) {
    super(project, address);
    this.color = {
      r: 0,
      g: 0,
      b: 0
    };
    this.strobe = 0;
    this.dimmer = 0;
  }
}