import { EventEmitter } from 'events';
import HID = require("node-hid");

let eventEmitter = new EventEmitter();
let devices = HID.devices().filter((dev) => dev.productId == 4613 && dev.vendorId == 10462);
let device = devices[2];
if (device == null) process.abort();
let controler = new HID.HID(device.path ?? "");
let lastValue = [0, 0, 0, 0];
let lastButtons = [false, false, false, false, false, false, false, false];
controler.on('data', (data: Buffer) => {
  let leftX = data.readInt8(49);
  let leftY = data.readInt8(51);
  let rightX = data.readInt8(53);
  let rightY = data.readInt8(55);
  leftX = Math.abs(leftX) > 32 ? leftX : 0;
  leftY = Math.abs(leftY) > 32 ? leftY : 0;
  rightX = Math.abs(rightX) > 10 ? rightX : 0;
  rightY = Math.abs(rightY) > 10 ? rightY : 0;
  if (leftX != lastValue[0] || leftY != lastValue[1])
    eventEmitter.emit('leftStickMove', { x: leftX, y: leftY });
  if (rightX != lastValue[2] || rightY != lastValue[3])
    eventEmitter.emit('rightStickMove', { x: rightX, y: rightY });
  lastValue = [leftX, leftY, rightX, rightY];
  /*let d = "";
  for(let i = 0; i < 64; i++) {
    d += data.readInt8(i) + "|";
  }
  console.log(d);*/
  let buttonByte1 = data.at(8) ?? 0;
  let buttons = [];
  buttons[0] = ((buttonByte1 >> 0) & 0x1) == 1;
  buttons[1] = ((buttonByte1 >> 1) & 0x1) == 1;
  buttons[2] = ((buttonByte1 >> 2) & 0x1) == 1;
  buttons[3] = ((buttonByte1 >> 3) & 0x1) == 1;
  buttons[4] = ((buttonByte1 >> 4) & 0x1) == 1;
  buttons[5] = ((buttonByte1 >> 5) & 0x1) == 1;
  buttons[6] = ((buttonByte1 >> 6) & 0x1) == 1;
  buttons[7] = ((buttonByte1 >> 7) & 0x1) == 1;
  //console.log(JSON.stringify({button1, button2, button3, button4, button5, button6, button7, button8}));
  for(let i = 0; i < 8; i++) {
    if(lastButtons[i] != buttons[i]) {
      //console.log(i, buttons[i]);
      eventEmitter.emit(`button${i}:changed`, buttons[i]);
      if(buttons[i]) {
        eventEmitter.emit(`button${i}:pressed`);
      } else {
        eventEmitter.emit(`button${i}:released`);
      }
    }
    lastButtons[i] = buttons[i];
  }
});



export default eventEmitter;