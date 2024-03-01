import Module from "new/Module";
import ModuleElement from "new/ModuleElement";
import * as WebSocket from 'ws';

class Module3DPreview extends Module {
    public wsServer: WebSocket.Server;

    constructor(config: ModuleElement) {
        super(config);
        this.wsServer = new WebSocket.Server({ port: 3000 });
        this.wsServer.on('connection', (socket) => {    
            setInterval(() => socket.send(JSON.stringify(this.project.devices)), 250)
        });
    }
}

export default Module3DPreview;