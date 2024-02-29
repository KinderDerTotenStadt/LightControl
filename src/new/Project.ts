import * as fs from "fs";
import ProjectConfig, { currentProject, setCurrentProject } from "./ProjectConfig";
import Device from "./Device";
import DeviceElement from "./DeviceElement";
import Element from "./Element";
import NamedElement from "./NamedElement";
import ModuleElement from "./ModuleElement";
import Module from "./Module";
import ArtNET, { DMXSender } from "ArtNET";

class Project {
    public ready: Promise<Project>;
    public config: ProjectConfig;
    public devices: {[id: string]: Device};
    public modules: {[id: string]: Module};
    public dmx: DMXSender;

    public constructor(public path: string) {
        this.config = new ProjectConfig();
        this.devices = {};
        this.modules = {};
        this.dmx = ArtNET.newSender({net: 0, subnet: 0, universe: 0, subuni: 0});
        this.ready = new Promise(async (resole) => {
            await this.load();
            fs.watchFile(this.path, () => this.load());
            resole(this);
        });
    }

    private async load() {
        setCurrentProject(this)
        await this.config.parse(this.path);
        this.devices = {};
        this.modules = {};
        await Promise.all(this.config.root.filter<DeviceElement>("device").map(async (element) => {
            let id = (((element.parent as NamedElement)?.name) ?? "") + "/" + element.name;
            let {device} = await element.ready;
            if(device == null) return;
            this.devices[id] = device;
        }));
        await Promise.all(this.config.root.filter<ModuleElement>("module").map(async (element) => {
            let id = (((element.parent as NamedElement)?.name) ?? "") + "/" + element.name;
            let {module} = await element.ready;
            if(module == null) return;
            this.modules[id] = module;
        }));
    }

    public async save() {
        await this.config.save(this.path);
    }
}

export default Project;