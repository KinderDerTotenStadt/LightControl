import Device from "new/Device";
import Project from "new/Project";

export default class Dimmer extends Device {
  public dimmer!: number;

  public constructor(project: Project) {
    super(project, [
      {name: "dimmer", default: 0}
    ]);
  }
}