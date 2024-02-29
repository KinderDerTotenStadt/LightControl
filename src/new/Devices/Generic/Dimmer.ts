import Device from "new/Device";
import Project from "new/Project";

export default class Dimmer extends Device {
  dimmer: number;

  public constructor(project: Project, address: string) {
    super(project, address);
    this.dimmer = 0;
  }
}