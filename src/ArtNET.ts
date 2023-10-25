import { dmxnet } from 'dmxnet';

let ArtNET = new dmxnet({
  log: { level: 'error' }, // info
  sName: "DMX-ArtNET",
  lName: "An DMX ArtNET Application",
  errFunc: console.error
});

export default ArtNET;

export { sender as DMXSender, receiver as DMXReceiver } from 'dmxnet';
