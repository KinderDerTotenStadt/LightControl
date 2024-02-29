
import Device from "new/Device";
import Project from "new/Project";

export default class Switch extends Device {
  on: boolean;

  public constructor(project: Project, address: string) {
    super(project, address);
    this.on = false;
  }
}