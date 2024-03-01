import Color from "Objects/Color";
import Device from "new/Device";
import Project from "new/Project";

export default class LedFloodPanel150RGB8Channel extends Device {
  public type = "Stairville/LedFloodPanel150RGB/8Channel";
  public dimmer!: number;
  public color!: Color;
  public strobe!: number;

  public constructor(project: Project) {
    super(project, [
      {name: 'dimmer', default: 0},
      {name: 'color.r', default: 0},
      {name: 'color.g', default: 0},
      {name: 'color.b', default: 0},
      {name: 'strobe', default: 0},
      {default: 0},
      {default: 0},
      {default: 0}
    ]);
  }
}