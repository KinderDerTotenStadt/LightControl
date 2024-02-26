import Color from "Objects/Color";
import XMLParser from "./XMLParser";

class Device {
    public pan: number = 200;
    public tilt: number = 60;
    public color: Color = {r: 128, g: 128, b: 128};

    public constructor() {
        setInterval(() => this.pan = Math.round((Math.random() + 1) * 0.5 * 360), 250);
    }
}

export default Device;