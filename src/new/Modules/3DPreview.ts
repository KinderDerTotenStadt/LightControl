import Module from "new/Module";
import Project from "new/Project";
import * as WebSocket from 'ws';

class Module3DPreview extends Module {
    public wsServer: WebSocket.Server;

    constructor(project: Project) {
        super(project);
        this.wsServer = new WebSocket.Server({ port: 3000 });
        this.wsServer.on('connection', (socket) => {    
            setInterval(() => socket.send(JSON.stringify(project.devices)), 250)
        });
    }
}

export default Module3DPreview;