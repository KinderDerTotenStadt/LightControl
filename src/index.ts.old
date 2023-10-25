import LedFloodPanel150RGB8Channel from '@device/Stairville/LedFloodPanel150RGB8Channel';
import ArtNET from './ArtNET';
import { hsl2rgb } from './util';
import Microphone from 'Microphone';
import BeatDetector from 'BeatDetector';
import Gain from 'Gain';
import * as Speaker from 'speaker';
import EL230RGBMK2 from '@device/Laserworld/EL230RGBMK2';
import Spot60Prism from '@device/Light4Me/Movinghead/Spot60Prism';

process.title = "dmx-art-net@1.0.0";

let dmx = ArtNET.newSender({ ip: "192.168.178.47", net: 0, subnet: 0, universe: 0 });

dmx.reset();
// mh1   | mh2     | laser   | par1     | par2   
// 1 - 9 | 10 - 18 | 19 - 27 | 28 - 35  | 36 - 44

let mh1 = new Spot60Prism(dmx, 0);
let mh2 = new Spot60Prism(dmx, 9);
let laser = new EL230RGBMK2(dmx, 18);
let par1 = new LedFloodPanel150RGB8Channel(dmx, 27);
let par2 = new LedFloodPanel150RGB8Channel(dmx, 35);

mh1.setStrobe(8);
mh1.setDimmer(255);
mh2.setStrobe(8);
mh2.setDimmer(255);

laser.setOn(true);
laser.setDynamic(false);
laser.setPettern(0);
laser.setX(255);
laser.setY(0);
laser.setScanSpeed(0);
laser.setPetternSpeed(0);
laser.setZoom(0);
laser.setColor(0);
laser.setColorSegment(0);

par1.setDimmer(255);
par2.setDimmer(255);

let degres = 0;
let mhcolor = 0;
let lasercolor = 0;
let mhx = 0;
let mhy = 0;
let mhi = true;
let mhay = true;
let mhax = false;

setInterval(() => {
  degres++;
  degres = degres % 360;
  par1.setColor(...hsl2rgb(degres, 1, 0.5));
  par2.setColor(...hsl2rgb(degres + 180, 1, 0.5));
}, 10);

const beat = (distance: number) => {
  degres += 180;
  mhcolor = (mhcolor + 1) % 8;
  mh1.setColor(mhcolor);
  mh2.setColor(mhcolor);
  lasercolor = (lasercolor + 1) % 7;
  laser.setColor(lasercolor);

  if (mhax) {
    mhx = (mhx == 0 ? 100 : 0);
    mh1.setPan(360 - 90 + ((mhx) / 100 * 180));
    mh2.setPan(360 - 90 + ((mhi ? 100 - mhx : mhx) / 100 * 180));
  }
  if (mhay) {
    mhy = (mhy == 0 ? 100 : 0);
    mh1.setTilt(mhy);
    mh2.setTilt(mhi ? 100 - mhy : mhy);
  }

  console.log(distance);
};

const soundOptions = {
  channels: 2,
  bitDepth: 16,
  sampleRate: 44100
}
let lastBeat = Date.now();
new Microphone({ ...soundOptions, device: 'VoiceMeeter Output (VB-Audio Vo' })
  .pipe(new BeatDetector({ sensitivity: 0.8 }))
  .on('peak-detected', () => { if (Math.abs(lastBeat - Date.now()) < 25) return; beat(Math.abs(lastBeat - Date.now())); lastBeat = Date.now(); })
  .pipe(new Gain({ gain: 1, ...soundOptions }))
  .pipe(new Speaker({ ...soundOptions, device: "VoiceMeeter Input (VB-Audio VoiceMeeter VAIO)" }));

// import { Worker } from 'worker_threads';
// let window1 = new Worker(require.resolve(`./window`));
// let window2 = new Worker(require.resolve(`./window`));

// import Window from "window";

// let window = new Window({
//   debug: true,
//   size: {
//     width: 800,
//     height: 600
//   },
//   title: "Test",
//   titleBar: false,
//   url: "https://google.com/"
// });