import Module from "./Module";
import NamedElement from "./NamedElement";
import Project from "./Project";
import { currentProject } from "./ProjectConfig";


class ProjectElement extends NamedElement {
    public project: Project;

    public constructor() {
        super();
        if(currentProject == null)  throw new Error("Current Project Null");
        this.project = currentProject;
    }
}

export default ProjectElement;