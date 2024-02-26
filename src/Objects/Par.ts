import Color from "./Color";

export default class Par {
    Color: Color;
    Strobe: boolean;
    Dimmer: number;
    
    constructor() {
        this.Color = {
            r: 0,
            g: 0,
            b: 0
        }
        this.Strobe = false;
        this.Dimmer = 0;
    }

    parse() {

    }

    toJSON() {
        return {
            color: this.Color,
            strobe: this.Strobe,
            dimmer: this.Dimmer
        }
    }
}