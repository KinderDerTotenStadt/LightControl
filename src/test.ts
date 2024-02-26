import MovingHead from 'Objects/MovingHead';
import Par from 'Objects/Par';
import Project from 'new/Project';
import * as WebSocket from 'ws';

let ws = new WebSocket.Server({ port: 3000 });
let project = new Project('project.xml');
ws.on('connection', (socket) => {    
    setInterval(() => socket.send(JSON.stringify(project.devices)), 250)
});