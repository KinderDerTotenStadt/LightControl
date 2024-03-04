import Device from "new/Device";
import DeviceElement from "new/DeviceElement";
import Project from "new/Project";

export default class Dimmer extends Device {
  public dimmer!: number;

  public constructor(config: DeviceElement) {
    super(config, [
      {name: "dimmer", default: 0}
    ]);
  }
}