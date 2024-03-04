import Spot60Prism from "new/Devices/Light4Me/Movinghead/Spot60Prism";
import LedFloodPanel150RGB8Channel from "new/Devices/Stairville/LedFloodPanel150RGB/8Channel";
import Module from "new/Module";
import ModuleElement from "new/ModuleElement";
// import * as WebSocket from 'ws';
import Steamdeck from 'steamdeck';

class ModuleSteamdeck extends Module {
    // public wsServer: WebSocket.Server;

    constructor(config: ModuleElement) {
        super(config);

        // this.wsServer = new WebSocket.Server({ port: 3001 });
        // this.wsServer.on('connection', (socket) => {  
        //     console.log("Steamdeck")  
        //     setInterval(() => socket.send(JSON.stringify(this.project.devices)), 250)
        // });

        let mh1 = (this.project.devices['Movinghead/Left'] as Spot60Prism);
        let mh2 = (this.project.devices['Movinghead/Right'] as Spot60Prism);
        let par1 = (this.project.devices['Zug/Left'] as LedFloodPanel150RGB8Channel);
        let par2 = (this.project.devices['Zug/Right'] as LedFloodPanel150RGB8Channel);

        let leftInterval: null | NodeJS.Timeout = null;
        let leftPosition: { x: number, y: number } = { x: 0, y: 0 };
        Steamdeck.on("leftStickMove", (position: { x: number, y: number }) => {
            if (position.x == 0 && position.y == 0) {
                if (leftInterval != null)
                    clearInterval(leftInterval);
                leftInterval = null;
            } else if (leftInterval == null) {
                leftInterval = setInterval(() => {
                    // console.log("left", leftPosition);
                    // mh1Pos[0] = Math.max(0, Math.min(540, mh1Pos[0] + leftPosition.x / 64));
                    // mh1Pos[1] = Math.max(0, Math.min(280, mh1Pos[1] - leftPosition.y / 64));
                    // console.log("mh1Pos", mh1Pos);
                    // mh1.setPan(mh1Pos[0]);
                    // mh1.setTilt(mh1Pos[1]);
                    mh1.pan = Math.max(0, Math.min(540, mh1.pan + leftPosition.x / 64));
                    mh1.tilt = Math.max(0, Math.min(280, mh1.tilt - leftPosition.y / 64));
                    console.log("mh1Pos", mh1.pan, mh1.tilt);
                }, 100);
            }
            leftPosition = position;
        });

        let rightInterval: null | NodeJS.Timeout = null;
        let rightPosition: { x: number, y: number } = { x: 0, y: 0 };
        Steamdeck.on("rightStickMove", (position: { x: number, y: number }) => {
            if (position.x == 0 && position.y == 0) {
                if (rightInterval != null)
                    clearInterval(rightInterval);
                rightInterval = null;
            } else if (rightInterval == null) {
                rightInterval = setInterval(() => {
                    // console.log("right", rightPosition);
                    // mh2Pos[0] = Math.max(0, Math.min(540, mh2Pos[0] + rightPosition.x / 64));
                    // mh2Pos[1] = Math.max(0, Math.min(280, mh2Pos[1] - rightPosition.y / 64));
                    // console.log("mh2Pos", mh2Pos);
                    // mh2.setPan(mh2Pos[0]);
                    // mh2.setTilt(mh2Pos[1]);
                    mh2.pan = Math.max(0, Math.min(540, mh2.pan + leftPosition.x / 64));
                    mh2.tilt = Math.max(0, Math.min(280, mh2.tilt - leftPosition.y / 64));
                    console.log("mh2Pos", mh2.pan, mh2.tilt);
                }, 100);
            }
            rightPosition = position;
        })

        let leftOn = false;
        Steamdeck.on("button3:pressed", () => {
            leftOn = !leftOn;
            mh1.strobe = (leftOn ? 8 : 0);
        });

        let rightOn = false;
        Steamdeck.on("button2:pressed", () => {
            rightOn = !rightOn;
            mh2.strobe = (rightOn ? 8 : 0);
        });

        Steamdeck.on("button4:pressed", () => {
            mh1.color = 6;
            mh2.color = 6;
            par1.color.r = 0;
            par1.color.g = 0;
            par1.color.b = 255;
            par2.color.r = 0;
            par2.color.g = 0;
            par2.color.b = 255;
        });


        Steamdeck.on("button5:pressed", () => {
            mh1.color = 2;
            mh2.color = 2;
            par1.color.r = 0;
            par1.color.g = 255;
            par1.color.b = 0;
            par2.color.r = 0;
            par2.color.g = 255;
            par2.color.b = 0;
        });

        Steamdeck.on("button6:pressed", () => {
            mh1.color = 0;
            mh2.color = 0;
            par1.color.r = 0;
            par1.color.g = 0;
            par1.color.b = 0;
            par2.color.r = 0;
            par2.color.g = 0;
            par2.color.b = 0;
        });

        Steamdeck.on("button7:pressed", () => {
            mh1.color = 4;
            mh2.color = 4;
            par1.color.r = 255;
            par1.color.g = 255;
            par1.color.b = 0;
            par2.color.r = 255;
            par2.color.g = 255;
            par2.color.b = 0;
        });
    }
}

export default ModuleSteamdeck;