import DeviceElement from "./DeviceElement";
import FolderElement from "./FolderElement";
import ModuleElement from "./ModuleElement";
import Project from "./Project";
import ProjectElement from "./ProjectElement";
import XMLParser from "./XMLParser";

export let setCurrentProject = (project: Project) => currentProject = project;
export let currentProject: Project | null = null;

class ProjectConfig extends XMLParser {
    public constructor() {
        super({
            'project': ProjectElement,
            'folder': FolderElement,
            'device': DeviceElement,
            'module': ModuleElement
        });
    }
}

export default ProjectConfig;