// import LedFloodPanel150RGB8Channel from '@device/Stairville/LedFloodPanel150RGB8Channel';
// import ArtNET, { DMXSender } from './ArtNET';
// import { hsl2rgb } from './util';
// import Microphone from 'Microphone';
// import BeatDetector from 'BeatDetector';
// import Gain from 'Gain';
// // import * as Speaker from 'speaker';
// import EL230RGBMK2 from '@device/Laserworld/EL230RGBMK2';
// import Spot60Prism from '@device/Light4Me/Movinghead/Spot60Prism';
// import * as commandLineArgs from 'command-line-args';
// // const XboxController = require('xbox-controller');
// import Steamdeck from 'steamdeck';
// import GenericDevice from '@device/GenericDevice';

// process.title = "@kinder-der-toten-stadt/light-control@1.0.0";


// function parseSender(sender: string) {
//   let ip = "127.0.0.1";
//   let port = "6454";
//   let [ipAndPort, net, subnet, universe] = sender.split('/');
//   if (ipAndPort.includes(":"))
//     [ip, port] = sender.split(':');
//   else
//     ip = ipAndPort;
//   return ArtNET.newSender({ net: Number(net), port: Number(port), subnet: Number(subnet), universe: Number(universe) });
// }



// const optionDefinitions = [
//   { name: 'sender', alias: 's', type: (sender: string) => parseSender(sender), multiple: false, defaultOption: true },
// ]

// let options = commandLineArgs(optionDefinitions);
// let dmx: DMXSender = options.sender;
// // let dmx = ArtNET.newSender({ ip: "192.168.178.47", net: 0, subnet: 0, universe: 0 });
// dmx.reset();

// // mh1   | mh2     | laser   | par1     | par2   
// // 1 - 9 | 10 - 18 | 19 - 27 | 28 - 35  | 36 - 44

// let mh1 = new Spot60Prism(dmx, 100);
// let mh2 = new Spot60Prism(dmx, 108);
// // let laser = new EL230RGBMK2(dmx, 18);
// let par1 = new LedFloodPanel150RGB8Channel(dmx, 0);
// let par2 = new LedFloodPanel150RGB8Channel(dmx, 8);

// let lights = new GenericDevice(dmx, 19, 8);

// let rec = ArtNET.newReceiver({net: 0, subnet: 0, universe: 0});
// rec.on('data', (data: Array<number>) => {
//   let lightData = data.slice(19, 19 + 8);
//   console.log(lightData);
//   lights.setChannel(0, data[19 + 0]);
//   lights.setChannel(0, data[19 + 1]);
//   lights.setChannel(0, data[19 + 2]);
//   lights.setChannel(0, data[19 + 3]);
//   lights.setChannel(0, data[19 + 4]);
//   lights.setChannel(0, data[19 + 5]);
//   lights.setChannel(0, data[19 + 6]);
//   lights.setChannel(0, data[19 + 7]);
// });

// mh1.setStrobe(0);
// mh1.setDimmer(128);
// //mh1.setColor(4);
// mh2.setStrobe(0);
// mh2.setDimmer(64);

// par1.setDimmer(255);
// par2.setDimmer(255);

// mh1.setPan(360 + 180);
// mh1.setTilt(0);
// mh2.setPan(360);
// mh2.setTilt(0);

// // let controler = new XboxController();
// // controler.on('right:move', function (position: any) {
// //   console.log('left:move', position);
// // });
// // console.log(controler);

// let mh1Pos = [360 + 180, 0];
// let mh2Pos = [360, 0];

// let leftInterval: null | NodeJS.Timeout = null;
// let leftPosition: { x: number, y: number } = { x: 0, y: 0 };
// Steamdeck.on("leftStickMove", (position: { x: number, y: number }) => {
//   if (position.x == 0 && position.y == 0) {
//     if (leftInterval != null)
//       clearInterval(leftInterval);
//     leftInterval = null;
//   } else if (leftInterval == null) {
//     leftInterval = setInterval(() => {
//       // console.log("left", leftPosition);
//       mh1Pos[0] = Math.max(0, Math.min(540, mh1Pos[0] + leftPosition.x / 64));
//       mh1Pos[1] = Math.max(0, Math.min(280, mh1Pos[1] - leftPosition.y / 64));
//       console.log("mh1Pos", mh1Pos);
//       mh1.setPan(mh1Pos[0]);
//       mh1.setTilt(mh1Pos[1]);
//     }, 100);
//   }
//   leftPosition = position;
// })

// let rightInterval: null | NodeJS.Timeout = null;
// let rightPosition: { x: number, y: number } = { x: 0, y: 0 };
// Steamdeck.on("rightStickMove", (position: { x: number, y: number }) => {
//   if (position.x == 0 && position.y == 0) {
//     if (rightInterval != null)
//       clearInterval(rightInterval);
//     rightInterval = null;
//   } else if (rightInterval == null) {
//     rightInterval = setInterval(() => {
//       // console.log("right", rightPosition);
//       mh2Pos[0] = Math.max(0, Math.min(540, mh2Pos[0] + rightPosition.x / 64));
//       mh2Pos[1] = Math.max(0, Math.min(280, mh2Pos[1] - rightPosition.y / 64));
//       console.log("mh2Pos", mh2Pos);
//       mh2.setPan(mh2Pos[0]);
//       mh2.setTilt(mh2Pos[1]);
//     }, 100);
//   }
//   rightPosition = position;
// })

// let leftOn = false;
// Steamdeck.on("button3:pressed", () => {
//   leftOn = !leftOn;
//   mh1.setStrobe(leftOn ? 8 : 0);
// });

// let rightOn = false;
// Steamdeck.on("button2:pressed", () => {
//   rightOn = !rightOn;
//   mh2.setStrobe(rightOn ? 8 : 0);
// });



// Steamdeck.on("button4:pressed", () => {
//   mh1.setColor(6);
//   mh2.setColor(6);
//   par1.setColor(0, 0, 255);
//   par2.setColor(0, 0, 255);
// });


// Steamdeck.on("button5:pressed", () => {
//   mh1.setColor(2);
//   mh2.setColor(2);
//   par1.setColor(0, 255, 0);
//   par2.setColor(0, 255, 0);
// });

// Steamdeck.on("button6:pressed", () => {
//   mh1.setColor(0);
//   mh2.setColor(0);
//   par1.setColor(0, 0, 0);
//   par2.setColor(0, 0, 0);
// });

// Steamdeck.on("button7:pressed", () => {
//   mh1.setColor(4);
//   mh2.setColor(4);
//   par1.setColor(255, 255, 0);
//   par2.setColor(255, 255, 0);
// });