import DeviceElement from "./DeviceElement";
import FolderElement from "./FolderElement";
import XMLParser from "./XMLParser";

class ProjectConfig extends XMLParser {
    public constructor() {
        super({
            'device': DeviceElement,
            'folder': FolderElement
        });
    }
}

export default ProjectConfig;