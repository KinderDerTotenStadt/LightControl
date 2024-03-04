
import Device from "new/Device";
import DeviceElement from "new/DeviceElement";

export default class Switch extends Device {
  public dimmer!: number;

  public constructor(config: DeviceElement) {
    super(config, [
      {name: "dimmer", default: 0, formatter: (value: number) => value == 0 ? 0 : 255}
    ]);
  }
}