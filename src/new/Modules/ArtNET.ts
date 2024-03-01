import Module from "new/Module";
import ModuleElement from "new/ModuleElement";

class ModuleArtNET extends Module {
    constructor(config: ModuleElement) {
        super(config);
        
        Object.values(this.project.devices).forEach(device => {
            device.on('dmxChanged', (channel: number, newValue: number) => {

            });
        });
    }
}

export default ModuleArtNET;