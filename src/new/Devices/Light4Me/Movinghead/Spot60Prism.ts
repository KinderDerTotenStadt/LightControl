import Device from "new/Device";
import DeviceElement from "new/DeviceElement";

export default class Spot60Prism extends Device {
  public type = "Light4Me/Movinghead/Spot60Prism";
  public pan!: number;
  public tilt!: number;
  public ptSpeed!: number;
  public strobe!: number;
  public dimmer!: number;
  public color!: number;
  public dualColor!: boolean;
  public spinColor!: boolean;
  public gobo!: number;
  public prism!: boolean;
  public prismRotation!: number;

  public constructor(config: DeviceElement) {
    super(config, [
      {name: 'pan', default: 0, formatter: (pan: number) => Math.min(Math.max(0, pan * 255 / 540), 255)},
      {name: 'tilt', default: 0, formatter: (tilt: number) => Math.min(Math.max(0, tilt * 255 / 280), 255)},
      {name: 'ptSpeed', default: 0},
      {name: 'strobe', default: 8},
      {name: 'dimmer', default: 0},
      {name: ['color', 'dualColor', 'spinColor'], default: [0, false, false], formatter: (color: number, dualColor: boolean, spinColor: boolean) => spinColor ? 128 : ((color % 8) * 16 + (dualColor ? 8 : 0))},
      {name: 'gobo', default: 0},
      {name: 'prism', default: false},
      {name: 'prismRotation', default: 0},
    ]);
  }
}