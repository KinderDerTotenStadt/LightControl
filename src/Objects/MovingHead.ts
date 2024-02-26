import Color from "./Color";

export default class MovingHead {
    Color: Color;
    Pan: number;
    Tilt: number;
    PTSpeed: number;
    Strobe: boolean;
    Dimmer: number;
    DualColor: boolean;
    SpinColor: number;
    Gobo: number;
    Prism: boolean;
    PrismRotation: number;

    constructor() {
        this.Color = {
            r: 0,
            g: 0,
            b: 0
        }
        this.Pan = 0;
        this.Tilt = 0;
        this.PTSpeed = 0;
        this.Strobe = false;
        this.Dimmer = 0;
        this.DualColor = false;
        this.SpinColor = 0;
        this.Gobo = 0;
        this.Prism = false;
        this.PrismRotation = 0;
    }

    parse() {

    }

    toJSON() {
        return {
            color: this.Color,
            pan: this.Pan,
            tilt: this.Tilt,
            ptSpeed: this.PTSpeed,
            strobe: this.Strobe,
            dimmer: this.Dimmer,
            dualColor: this.DualColor,
            spinColor: this.SpinColor,
            gobo: this.Gobo,
            prism: this.Prism,
            prismRotation: this.PrismRotation
        }
    }
}