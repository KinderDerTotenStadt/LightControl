import { EventEmitter } from 'events';
import HID = require("node-hid");

let eventEmitter = new EventEmitter();
let devices = HID.devices().filter((dev) => dev.productId == 4613 && dev.vendorId == 10462);
let device = devices[2];
if (device == null) process.abort();
let controler = new HID.HID(device.path ?? "");
let lastValue = [0, 0, 0, 0]
controler.on('data', (data: Buffer) => {
  let leftX = data.readInt8(49);
  let leftY = data.readInt8(51);
  let rightX = data.readInt8(53);
  let rightY = data.readInt8(55);
  leftX = Math.abs(leftX) > 10 ? leftX : 0;
  leftY = Math.abs(leftY) > 10 ? leftY : 0;
  rightX = Math.abs(rightX) > 10 ? rightX : 0;
  rightY = Math.abs(rightY) > 10 ? rightY : 0;
  // if (leftX != lastValue[0] || leftY == lastValue[1] || rightX != lastValue[2] || rightY != lastValue[3]) {
  //   console.log({ leftX, leftY, rightX, rightY });
  //   lastValue = [leftX, leftY, rightX, rightY];
  // }
  if (leftX != lastValue[0] || leftY != lastValue[1])
    eventEmitter.emit('leftStickMove', { x: leftX, y: leftY });
  // console.log({ leftX, leftY });
  if (rightX != lastValue[2] || rightY != lastValue[3])
    eventEmitter.emit('rightStickMove', { x: rightX, y: rightY });
  // console.log({ rightX, rightY });
  lastValue = [leftX, leftY, rightX, rightY];
});



export default eventEmitter;