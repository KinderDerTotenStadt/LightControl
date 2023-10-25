import GenericRGBDevice from "@device/GenericRGBDevice";
import { DMXSender } from "ArtNET";

export default class LedFloodPanel150RGB3Channel extends GenericRGBDevice {
  public constructor(dmx: DMXSender, address: number) {
    super(dmx, address);
  }
}