import { DMXSender } from "ArtNET";
import Device from "./Device";
import NamedElement from "./NamedElement";
import ProjectElement from "./ProjectElement";

class DeviceElement extends NamedElement {
    public ready: Promise<DeviceElement>;
    public device?: Device;

    public constructor() {
        super();
        this.ready = new Promise(async (resolve) => {
            let deviceType = await this.loadType(this.attributes['type'].toString());
            this.device = new deviceType((this.root as ProjectElement).project, this.attributes['address'].toString());
            resolve(this);
        });
    }

    private async loadType(type: string): Promise<typeof Device> {
        return (await import('./Devices/' + type)).default;
    }
}

export default DeviceElement;