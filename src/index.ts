import LedFloodPanel150RGB8Channel from '@device/Stairville/LedFloodPanel150RGB8Channel';
import ArtNET, { DMXSender } from './ArtNET';
import { hsl2rgb } from './util';
import Microphone from 'Microphone';
import BeatDetector from 'BeatDetector';
import Gain from 'Gain';
import * as Speaker from 'speaker';
import EL230RGBMK2 from '@device/Laserworld/EL230RGBMK2';
import Spot60Prism from '@device/Light4Me/Movinghead/Spot60Prism';
import * as commandLineArgs from 'command-line-args';
// const XboxController = require('xbox-controller');
import Steamdeck from 'steamdeck';

process.title = "@kinder-der-toten-stadt/light-control@1.0.0";

function parseSender(sender: string) {
  let ip = "127.0.0.1";
  let port = "6454";
  let [ipAndPort, net, subnet, universe] = sender.split('/');
  if (ipAndPort.includes(":"))
    [ip, port] = sender.split(':');
  else
    ip = ipAndPort;
  return ArtNET.newSender({ ip, net: Number(net), port: Number(port), subnet: Number(subnet), universe: Number(universe) });
}

const optionDefinitions = [
  { name: 'sender', alias: 's', type: (sender: string) => parseSender(sender), multiple: false, defaultOption: true },
]

let options = commandLineArgs(optionDefinitions);
let dmx: DMXSender = options.sender;
// let dmx = ArtNET.newSender({ ip: "192.168.178.47", net: 0, subnet: 0, universe: 0 });
dmx.reset();

// mh1   | mh2     | laser   | par1     | par2   
// 1 - 9 | 10 - 18 | 19 - 27 | 28 - 35  | 36 - 44

let mh1 = new Spot60Prism(dmx, 0);
let mh2 = new Spot60Prism(dmx, 9);
// let laser = new EL230RGBMK2(dmx, 18);
let par1 = new LedFloodPanel150RGB8Channel(dmx, 27);
let par2 = new LedFloodPanel150RGB8Channel(dmx, 35);

mh1.setStrobe(8);
mh1.setDimmer(255);
mh2.setStrobe(8);
mh2.setDimmer(255);

par1.setDimmer(255);
par2.setDimmer(255);

mh1.setPan(0);
mh1.setTilt(0);
mh2.setPan(0);
mh2.setTilt(0);

// let controler = new XboxController();
// controler.on('right:move', function (position: any) {
//   console.log('left:move', position);
// });
// console.log(controler);

let mh1Pos = [0, 0];
let mh2Pos = [0, 0];

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
      mh1Pos[0] = Math.max(0, Math.min(540, mh1Pos[0] + leftPosition.x / 32));
      mh1Pos[1] = Math.max(0, Math.min(280, mh1Pos[1] + leftPosition.y / 32));
      // console.log("mh1Pos", mh1Pos);
      mh1.setPan(mh1Pos[0]);
      mh1.setTilt(mh1Pos[1]);
    }, 100);
  }
  leftPosition = position;
})

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
      mh2Pos[0] = Math.max(0, Math.min(540, mh2Pos[0] + rightPosition.x / 32));
      mh2Pos[1] = Math.max(0, Math.min(280, mh2Pos[1] + rightPosition.y / 32));
      // console.log("mh2Pos", mh2Pos);
      mh2.setPan(mh2Pos[0]);
      mh2.setTilt(mh2Pos[1]);
    }, 100);
  }
  rightPosition = position;
})