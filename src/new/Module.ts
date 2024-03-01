import Color from "Objects/Color";
import XMLParser from "./XMLParser";
import Project from "./Project";
import ModuleElement from "./ModuleElement";
import ProjectElement from "./ProjectElement";

class Module {
    public project: Project;

    public constructor(public config: ModuleElement) {
        this.project = (config.root as ProjectElement).project;
    }
}

export default Module;