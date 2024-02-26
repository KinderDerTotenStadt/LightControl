import * as fs from "fs";
import ProjectConfig from "./ProjectConfig";
import Device from "./Device";
import DeviceElement from "./DeviceElement";
import Element from "./Element";
import NamedElement from "./NamedElement";

class Project {
    public config: ProjectConfig;
    public devices: {[id: string]: Device};

    public constructor(public path: string) {
        this.config = new ProjectConfig();
        this.devices = {};
        this.load();
        fs.watchFile(this.path, () => this.load());
    }

    private async load() {
        await this.config.parse(this.path);
        this.devices = {};
        this.config.root.filter<DeviceElement>("device").forEach(element => {
            this.devices[(((element.parent as NamedElement)?.name) ?? "") + "/" + element.name] = element.device;
        });
    }

    public async save() {
        await this.config.save(this.path);
    }
}

export default Project;