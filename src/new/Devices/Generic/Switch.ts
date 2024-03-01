
import Device from "new/Device";
import Project from "new/Project";

export default class Switch extends Device {
  public dimmer!: number;

  public constructor(project: Project) {
    super(project, [
      {name: "dimmer", default: 0, formatter: (value: number) => value == 0 ? 0 : 255}
    ]);
  }
}