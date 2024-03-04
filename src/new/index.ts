import Spot60Prism from "./Devices/Light4Me/Movinghead/Spot60Prism";
import LedFloodPanel150RGB8Channel from "./Devices/Stairville/LedFloodPanel150RGB/8Channel";
import Project from "./Project";

(async () => {
    let project = await new Project('project.xml').ready;
    setTimeout(() => {
        // (project.devices['Movinghead/Left'] as Spot60Prism).dimmer = 64;
        // (project.devices['Movinghead/Right'] as Spot60Prism).dimmer = 64;
        // setInterval(() => {
        //     // (project.devices['Movinghead/Left'] as Spot60Prism).pan = Math.random() * 540;
        //     // (project.devices['Movinghead/Right'] as Spot60Prism).pan = Math.random() * 540;
        // }, 2000);

        let mh1 = (project.devices['Movinghead/Left'] as Spot60Prism);
        let mh2 = (project.devices['Movinghead/Right'] as Spot60Prism);
        let par1 = (project.devices['Zug/Left'] as LedFloodPanel150RGB8Channel);
        let par2 = (project.devices['Zug/Right'] as LedFloodPanel150RGB8Channel);

        mh1.dimmer = 64;
        mh1.pan = 360 + 180;
        mh2.dimmer = 64;
        mh1.pan = 360;
        par1.dimmer = 255;
        par2.dimmer = 255;
    }, 100);
})()
