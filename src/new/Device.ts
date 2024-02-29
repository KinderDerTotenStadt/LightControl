import { DMXSender } from "ArtNET";
import XMLParser from "./XMLParser";
import Project from "./Project";

class Device {
    // public pan: number = 200;
    // public tilt: number = 60;
    // public color: Color = {r: 128, g: 128, b: 128};
    // public dimmer: number = 128;

    public constructor(public project: Project, public address: string) {
        // setInterval(() => this.pan = Math.round((Math.random() + 1) * 0.5 * 360), 250);
        // setInterval(() => this.dimmer = Math.round((Math.random() + 1) * 0.5 * 255), 250);
    }

    toJSON() {
        return ({...this, project: undefined })
    }
}

export default Device;