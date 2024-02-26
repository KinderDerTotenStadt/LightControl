import Device from "./Device";
import NamedElement from "./NamedElement";

class DeviceElement extends NamedElement {
    public device;

    public constructor() {
        super();
        this.device = new Device();
    }
}

export default DeviceElement;