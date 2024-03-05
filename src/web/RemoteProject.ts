import Device from "new/Device";
import Project from "new/Project";
import './Throttle';

class RemoteProject {
    public devices: Project['devices'] = {};
    public ws: WebSocket;
    public ready: Promise<this>;

    constructor() {
        this.ws = new WebSocket(`wss://${window.location.host}/api/`);
        let send = ((data: any) => {
            this.ws.send(JSON.stringify(data));
        }).throttle(100);
        this.ready = new Promise((reoslve) => {
            this.ws.addEventListener('error', console.error);
            this.ws.addEventListener('open', () => {
                this.ws.addEventListener('message', ({ data }) => {
                    let json = JSON.parse(data) as Project['devices'];
                    Object.entries(json).forEach(([id, device]) => {
                        if (this.devices[id] == null) {
                            this.devices[id] = {} as Device;
                            Object.entries(device).forEach(([property, value]) => {
                                Object.defineProperty(this.devices[id], property, {
                                    get: () => value,
                                    set: (newValue) => {
                                        value = newValue;
                                        send({[id]: {[property]: value}});
                                    }
                                });
                            });
                        } else {

                        }
                    });
                    reoslve(this);
                });
            });
        });
    }
}



export default RemoteProject;