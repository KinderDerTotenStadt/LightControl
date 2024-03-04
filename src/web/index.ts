async function connect() {
    const device = (await navigator.hid.requestDevice({ filters: [{ productId: 4613, vendorId: 10462 }] }))[0];
    if (device == null) return;
    await setup(device);
}

document.addEventListener('DOMContentLoaded' ,async () => {
    const device = (await navigator.hid.getDevices()).find(device => device.productId == 4613 && device.vendorId == 10462);
    if(device == null) return;
    await setup(device);
});

async function setup(device: HIDDevice) {
    let controllerStatusButton = document.querySelector('#controller-status > button');
    if(controllerStatusButton != null)
        controllerStatusButton.outerHTML = "Connected"
    if (!device.opened)
        await device.open();

    // device.addEventListener('inputreport', ({ data }) => {
        // let out = [];
        // for(let i = 0; i < 64; i++) {
        //     out[i] = data.getUint8(i);
        // }
        // console.log(out);
    // });


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

    };

    joystick: {

    };

    gyroscope: [];

    constructor(data: DataView) {
        this.buttons = {

        };
        this.dpad = {

        };
        this.trigger = {

        };
        this.touchpad = {

        };
        this.joystick = {

        };
        this.gyroscope = [
            
        ];
    }
}