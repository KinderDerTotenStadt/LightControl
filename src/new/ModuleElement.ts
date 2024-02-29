import Module from "./Module";
import NamedElement from "./NamedElement";
import ProjectElement from "./ProjectElement";

class ModuleElement extends NamedElement {
    public ready: Promise<ModuleElement>;
    public module?: Module;

    public constructor() {
        super();
        this.ready = new Promise(async (resolve) => {
            let moduleType = await this.loadType(this.attributes['type'].toString());
            this.module = new moduleType((this.root as ProjectElement).project);
            resolve(this);
        });
    }

    private async loadType(type: string): Promise<typeof Module> {
        return (await import('./Modules/' + type)).default;
    }
}

export default ModuleElement;