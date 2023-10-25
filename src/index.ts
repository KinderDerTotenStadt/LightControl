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