import ArtNET from "ArtNET";
import Switch from "new/Devices/Generic/Switch";
import Module from "new/Module";
import ModuleElement from "new/ModuleElement";

class ModuleArtNET extends Module {
    constructor(config: ModuleElement) {
        super(config);
        if (this.config.attributes['direction'] == "send") {
            let { net, subnet, universe, subuni } = this.config.attributes;
            let sender = ArtNET.newSender({
                net: net != null ? Number(net) : 0,
                subnet: subnet != null ? Number(subnet) : 0,
                universe: universe != null ? Number(universe) : 0,
                subuni: subuni != null ? Number(subuni) : 0
            });
            this.project.ready.then(() => {
                Object.keys(this.project.devices).forEach(deviceId => {
                    let device = this.project.devices[deviceId];
                    let address = Number((device.config.attributes['address']?.toString() ?? "").split('.')[1]);
                    device.dmxChannels.forEach((value: number, channel: number) => {
                        console.log(address + channel, value);
                        sender.setChannel(address + channel, value);
                    })
                    device.on('dmxChanged', (channel: number, value: number) => {
                        console.log(address + channel, value);
                        sender.setChannel(address + channel, value);
                    });
                });
            });
        } else if (this.config.attributes['direction'] == "receive") {
            let { net, subnet, universe, subuni } = this.config.attributes;
            let receiver = ArtNET.newReceiver({
                net: net != null ? Number(net) : 0,
                subnet: subnet != null ? Number(subnet) : 0,
                universe: universe != null ? Number(universe) : 0,
                subuni: subuni != null ? Number(subuni) : 0
            });

            this.project.ready.then(() => {
                let lights = [
                    (this.project.devices['Left/1'] as Switch),
                    (this.project.devices['Left/2'] as Switch),
                    (this.project.devices['Left/3'] as Switch),
                    (this.project.devices['Left/4'] as Switch),
                    (this.project.devices['Right/1'] as Switch),
                    (this.project.devices['Right/2'] as Switch),
                    (this.project.devices['Right/3'] as Switch),
                    (this.project.devices['Right/4'] as Switch),
                ];

                receiver.on('data', (data: Array<number>) => {
                    let lightData = data.slice(19, 19 + 8);
                    for (let index = 0; index < lights.length; index++)
                        lights[index].dimmer = lightData[index];
                });
            });
        }
    }
}

export default ModuleArtNET;