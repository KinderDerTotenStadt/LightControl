import GenericRGBDimmerDevice from "@device/GenericRGBDimmerDevice";
import { DMXSender } from "ArtNET";

export default class LedFloodPanel150RGB4Channel extends GenericRGBDimmerDevice {
  public constructor(dmx: DMXSender, address: number) {
    super(dmx, address);
  }
}