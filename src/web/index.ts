import { EventEmitter } from "events";

async function connect() {
    const device = (await navigator.hid.requestDevice({ filters: [{ productId: 4613, vendorId: 10462 }] }))[0];
    if (device == null) return;
    await setup(device);
}

document.addEventListener('DOMContentLoaded', async () => {
    const device = (await navigator.hid.getDevices()).find(device => device.productId == 4613 && device.vendorId == 10462);
    if (device == null) return;
    await setup(device);
});

async function setup(device: HIDDevice) {
    let steamdeck = await new Steamdeck(device).ready;
    let controllerStatusButton = document.querySelector('#controller-status > button');
    if (controllerStatusButton != null)
        controllerStatusButton.outerHTML = "Connected";
}

class Steamdeck extends EventEmitter {
    public ready: Promise<this>;

    constructor(device: HIDDevice) {
        super();
        this.ready = new Promise(async (resolve) => {
            if (!device.opened)
                await device.open();
            device.addEventListener('inputreport', ({ data }) => this.emit('data', new SteamdeckInputPacket(data)));
            resolve(this);
        });
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