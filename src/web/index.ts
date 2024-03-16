import { EventEmitter } from "events";
import Spot60Prism from "new/Devices/Light4Me/Movinghead/Spot60Prism";
import LedFloodPanel150RGB8Channel from "new/Devices/Stairville/LedFloodPanel150RGB/8Channel";
import devices from "./RemoteProject";
import RemoteProject from "./RemoteProject";
import presets from "./presets";

async function connect() {
    const device = (await navigator.hid.requestDevice({ filters: [{ productId: 4613, vendorId: 10462 }] }))[0];
    if (device == null) return;
    await setup(device);
}

document.addEventListener('DOMContentLoaded', async () => {
    document.querySelector('#controller-status > button')?.addEventListener('click', connect);
    document.querySelectorAll('.presets > button').forEach(button => button.addEventListener('click', () => applyPreset(button.getAttribute('preset'))));
    const device = (await navigator.hid.getDevices()).find(device => device.productId == 4613 && device.vendorId == 10462);
    if (device == null) return;
    // device.forget();
    await setup(device);
});

function applyPreset(name: string | null) {
    if(name == null) return;
    let preset = presets[name];
    let project = (window as unknown as {project: RemoteProject}).project;
    Object.entries(preset).forEach(([id, state]) => {
        let device = project.devices[id];
        Object.entries(state as any).forEach(([property, value]) => {
            (device as {[property: string]: any})[property] = value;
        });
    });
}

const blue = {
    r: 0,
    g: 0,
    b: 255
};

const green = {
    r: 0,
    g: 255,
    b: 0
};

const yellow = {
    r: 255,
    g: 255,
    b: 0
};

const red = {
    r: 255,
    g: 0,
    b: 0
};

const white = {
    r: 255,
    g: 255,
    b: 255
};

const black = {
    r: 0,
    g: 0,
    b: 0
};


async function setup(device: HIDDevice) {
    let steamdeck = await new Steamdeck(device).ready;
    let controllerStatusButton = document.querySelector('#controller-status > button');
    if (controllerStatusButton != null)
        controllerStatusButton.outerHTML = "Connected";
    let project = await new RemoteProject().ready;
    (window as unknown as {project: RemoteProject}).project = project;
    let websocketStatusText = document.querySelector('#websocket-status > span');
    if (websocketStatusText != null)
        websocketStatusText.innerHTML = "Connected";

    let movingheadLeft = (project.devices['Movinghead/Left'] as Spot60Prism);
    let movingheadRight = (project.devices['Movinghead/Right'] as Spot60Prism);
    let parZugLeft = (project.devices['Zug/Left'] as LedFloodPanel150RGB8Channel);
    let parZugRight = (project.devices['Zug/Right'] as LedFloodPanel150RGB8Channel);

    setupSpot(steamdeck, "left", movingheadLeft);
    setupSpot(steamdeck, "right", movingheadRight);

    steamdeck.on(`button:y:pressed`, () => {
        movingheadLeft.color = 6;
        movingheadRight.color = 6;
        parZugLeft.color = blue;
        parZugRight.color = blue;
    });

    steamdeck.on(`button:b:pressed`, () => {
        movingheadLeft.color = 2;
        movingheadRight.color = 2;
        parZugLeft.color = green;
        parZugRight.color = green;
    });

    steamdeck.on(`button:a:pressed`, () => {
        movingheadLeft.color = 4;
        movingheadRight.color = 4;
        parZugLeft.color = yellow;
        parZugRight.color = yellow;
    });

    steamdeck.on(`button:x:pressed`, () => {
        movingheadLeft.color = 1;
        movingheadRight.color = 1;
        parZugLeft.color = red;
        parZugRight.color = red;
    });

    steamdeck.on(`button:r4:pressed`, () => {
        movingheadLeft.color = 0;
        movingheadRight.color = 0;
        parZugLeft.color = white;
        parZugRight.color = white;
    });

    steamdeck.on(`button:r5:pressed`, () => {
        movingheadLeft.color = 0;
        movingheadRight.color = 0;
        parZugLeft.color = black;
        parZugRight.color = black;
    });



    let gobos = false;
    steamdeck.on(`dpad:up:pressed`, () => {
        gobos = ! gobos;
        if(gobos) {
            movingheadLeft.gobo = 8 * 0; // 0, 3
            movingheadLeft.prism = true;
            movingheadLeft.prismRotation = 128;
        } else {
            movingheadLeft.gobo = 0;
            movingheadLeft.prism = false;
            movingheadLeft.prismRotation = 0;
        }
        movingheadRight.gobo = movingheadLeft.gobo;
        movingheadRight.prism = movingheadLeft.prism;
        movingheadRight.prismRotation = movingheadLeft.prismRotation;
    });

    steamdeck.on(`button:l4:pressed`, () => {
        movingheadLeft.dimmer = Math.max(16, Math.min(255, movingheadLeft.dimmer + 16));
        movingheadRight.dimmer = movingheadLeft.dimmer;
    });

    steamdeck.on(`button:l5:pressed`, () => {
        movingheadLeft.dimmer = Math.max(16, Math.min(255, movingheadLeft.dimmer - 16));
        movingheadRight.dimmer = movingheadLeft.dimmer;
    });
}

function setupSpot(steamdeck: Steamdeck, side: string, movinghead: Spot60Prism) {
    steamdeck.on(`joystick:${side}:position:changed`, (position: Position) => {
        movinghead.pan = Math.max(0, Math.min(540, movinghead.pan + position.x / 32767 / 8));
        movinghead.tilt = Math.max(0, Math.min(280, movinghead.tilt + position.y / 32767 / 8));
    });
    steamdeck.on(`button:${side.substring(0, 1)}1:pressed`, () => movinghead.strobe = movinghead.strobe == 8 ? 0 : 8);
}

class Steamdeck extends EventEmitter {
    public ready: Promise<this>;
    public state: SteamdeckInputPacket = new SteamdeckInputPacket(new DataView(new ArrayBuffer(64)));
    private oldState: SteamdeckInputPacket = new SteamdeckInputPacket(new DataView(new ArrayBuffer(64)));

    constructor(device: HIDDevice) {
        super();
        this.ready = new Promise(async (resolve) => {
            if (!device.opened)
                await device.open();
            device.addEventListener('inputreport', ({ data }) => this.emit('data', new SteamdeckInputPacket(data)));
            const working = () => {
                console.log('Steamdeck Connected!')
                device.removeEventListener('inputreport', working);
            }
            device.addEventListener('inputreport', working);
            // device.addEventListener('inputreport', ({ data }) => console.log(data));
            this.on('data', (data: SteamdeckInputPacket) => {
                // console.log(data);
                this.state = data;
                Object.entries(data.buttons).forEach(([button, state]) => {
                    if ((this.oldState.buttons as { [button: string]: boolean })[button] == state) return;
                    this.emit(`button:${button}:changed`, state);
                    if (state) this.emit(`button:${button}:pressed`);
                    else this.emit(`button:${button}:released`);
                });
                Object.entries(data.dpad).forEach(([button, state]) => {
                    if ((this.oldState.dpad as { [button: string]: boolean })[button] == state) return;
                    this.emit(`dpad:${button}:changed`, state);
                    if (state) this.emit(`dpad:${button}:pressed`);
                    else this.emit(`dpad:${button}:released`);
                });
                Object.entries(data.trigger).forEach(([trigger, state]) => {
                    if ((this.oldState.trigger as { [trigger: string]: number })[trigger] == state) return;
                    this.emit(`trigger:${trigger}:changed`, state);
                });
                Object.entries(data.joystick).forEach(([joystick, state]) => {
                    let oldJoystick = (this.oldState.joystick as { [joystick: string]: Joystick })[joystick];
                    if (oldJoystick.click != state.click) {
                        this.emit(`joystick:${joystick}:click:changed`, state.click);
                        if (state.click) this.emit(`joystick:${joystick}:click:pressed`);
                        else this.emit(`joystick:${joystick}:click:released`);
                    };
                    if (oldJoystick.touch != state.touch) {
                        this.emit(`joystick:${joystick}:touch:changed`, state.touch);
                        if (state.touch) this.emit(`joystick:${joystick}:touch:pressed`);
                        else this.emit(`joystick:${joystick}:touch:released`);
                    };
                    if(Math.abs(state.position.x) > 5000 || Math.abs(state.position.y) > 5000) {
                        this.emit(`joystick:${joystick}:position:changed`, state.position);
                    }
                });
                Object.entries(data.touchpad).forEach(([touchpad, state]) => {
                    let oldTouchpad = (this.oldState.touchpad as { [touchpad: string]: Touchpad })[touchpad];
                    if (oldTouchpad.click != state.click) {
                        this.emit(`touchpad:${touchpad}:click:changed`, state.click);
                        if (state.click) this.emit(`touchpad:${touchpad}:click:pressed`);
                        else this.emit(`touchpad:${touchpad}:click:released`);
                    };
                    if (oldTouchpad.touch != state.touch) {
                        this.emit(`touchpad:${touchpad}:touch:changed`, state.touch);
                        if (state.touch) this.emit(`touchpad:${touchpad}:touch:pressed`);
                        else this.emit(`touchpad:${touchpad}:touch:released`);
                    };
                    if(oldTouchpad.pressure != state.pressure) {
                        this.emit(`touchpad:${touchpad}:pressure:changed`, state.position);
                    }
                    if(oldTouchpad.position.x != state.position.x || oldTouchpad.position.y != state.position.y) {
                        this.emit(`touchpad:${touchpad}:position:changed`, state.position);
                    }
                });
                this.oldState = data;
            });
            resolve(this);
        });
    }

    onMany(events: Array<string>, callback: Function) {    
        events.forEach((ev) => this.on(ev, (...args) => callback(ev, ...args)));
    }
    
}

interface Position {
    x: number;
    y: number;
};

interface Touchpad {
    touch: boolean;
    click: boolean;
    pressure: number;
    position: Position;
};

interface Joystick {
    touch: boolean;
    click: boolean;
    position: Position;
}

class SteamdeckInputPacket {
    buttons: {
        l1: boolean;
        r1: boolean;
        l2: boolean;
        r2: boolean;
        l3: boolean;
        r3: boolean;
        l4: boolean;
        r4: boolean;
        l5: boolean;
        r5: boolean;
        a: boolean;
        b: boolean;
        x: boolean;
        y: boolean;
        menu: boolean;
        view: boolean;
        steam: boolean;
        quickAcces: boolean;
    };

    dpad: {
        up: boolean;
        right: boolean;
        left: boolean;
        down: boolean;
    };

    trigger: {
        left: number;
        right: number;
    };

    touchpad: {
        left: Touchpad;
        right: Touchpad;
    };

    joystick: {
        left: Joystick;
        right: Joystick;
    };

    gyroscope: [];

    constructor(data: DataView) {
        let buttonBytes = [];
        for (let i = 0; i < 8; i++)
            buttonBytes[i] = data.getUint8(i + 8);
        this.buttons = {
            l1: ((buttonBytes[0] >> 3) & 0x1) == 1,
            r1: ((buttonBytes[0] >> 2) & 0x1) == 1,
            l2: ((buttonBytes[0] >> 1) & 0x1) == 1,
            r2: ((buttonBytes[0] >> 0) & 0x1) == 1,
            l3: ((buttonBytes[2] >> 6) & 0x1) == 1,
            r3: ((buttonBytes[3] >> 2) & 0x1) == 1,
            l4: ((buttonBytes[5] >> 1) & 0x1) == 1,
            r4: ((buttonBytes[5] >> 2) & 0x1) == 1,
            l5: ((buttonBytes[1] >> 7) & 0x1) == 1,
            r5: ((buttonBytes[2] >> 0) & 0x1) == 1,
            a: ((buttonBytes[0] >> 7) & 0x1) == 1,
            b: ((buttonBytes[0] >> 5) & 0x1) == 1,
            x: ((buttonBytes[0] >> 6) & 0x1) == 1,
            y: ((buttonBytes[0] >> 4) & 0x1) == 1,
            menu: ((buttonBytes[1] >> 4) & 0x1) == 1,
            view: ((buttonBytes[1] >> 6) & 0x1) == 1,
            steam: ((buttonBytes[1] >> 5) & 0x1) == 1,
            quickAcces: ((buttonBytes[6] >> 2) & 0x1) == 1,
        };
        this.dpad = {
            up: ((buttonBytes[1] >> 0) & 0x1) == 1,
            right: ((buttonBytes[1] >> 1) & 0x1) == 1,
            left: ((buttonBytes[1] >> 2) & 0x1) == 1,
            down: ((buttonBytes[1] >> 3) & 0x1) == 1,
        };
        this.trigger = {
            left: data.getInt16(44, true),
            right: data.getInt16(46, true)
        };
        this.touchpad = {
            left: this.readTouchpad(data, [10, 3, 10, 1, 56, 16]),
            right: this.readTouchpad(data, [10, 4, 10, 2, 58, 20]),
        };
        this.joystick = {
            left: this.readJoystick(data, [13, 6, 10, 6, 48]),
            right: this.readJoystick(data, [13, 7, 11, 2, 52]),
        };
        this.gyroscope = [

        ];
    }

    readTouchpad(data: DataView, addresses: Array<number>): Touchpad {
        return {
            touch: ((data.getUint8(addresses[0]) >> addresses[1]) & 0x1) == 1,
            click: ((data.getUint8(addresses[2]) >> addresses[3]) & 0x1) == 1,
            pressure: data.getInt16(addresses[4], true),
            position: {
                x: data.getInt16(addresses[5], true),
                y: data.getInt16(addresses[5] + 2, true)
            }
        }
    }

    readJoystick(data: DataView, addresses: Array<number>): Joystick {
        return {
            touch: ((data.getUint8(addresses[0]) >> addresses[1]) & 0x1) == 1,
            click: ((data.getUint8(addresses[2]) >> addresses[3]) & 0x1) == 1,
            position: {
                x: data.getInt16(addresses[4], true),
                y: data.getInt16(addresses[4] + 2, true)
            }
        }
    }
}