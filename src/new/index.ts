import Project from "./Project";

(async () => {
    let project = await new Project('project.xml').ready;
    console.log(project.modules['modules/3D-Preview']);
})()
