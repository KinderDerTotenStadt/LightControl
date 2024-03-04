import { EventEmitter } from "events";
import Project from "./Project";
import ProjectConfig from "./ProjectConfig";
import DeviceElement from "./DeviceElement";
import ProjectElement from "./ProjectElement";

interface Channel<K extends (number | boolean) = any> {
    name?: string | Array<string>;
    default: K | Array<K>;
    formatter?: ((value: K) => number) | ((...values: Array<K>) => number);
}

class Device extends EventEmitter {
    public dmxChannels: Array<number> = [];
    public project: Project;

    public constructor(public config: DeviceElement, public channels: Array<Channel>) {
        super();
        this.project = (config.root as ProjectElement).project;
        this.channels.forEach((channel, i) => {
            if (Array.isArray(channel.default) && channel.formatter != null)
                this.dmxChannels.push((channel.formatter as (...values: Array<number | boolean>) => number)(...channel.default));
            else if (!Array.isArray(channel.default) && channel.formatter != null)
                this.dmxChannels.push(channel.formatter(channel.default));
            else if (Array.isArray(channel.default))
                this.dmxChannels.push(Number(channel.default[0]));
            else
                this.dmxChannels.push(Number(channel.default));
            this.dmxChannels[i] = Math.round(this.dmxChannels[i]);
            if (channel.name == null) return;
            (Array.isArray(channel.name) ? channel.name : [channel.name]).forEach((property, j) => {
                let value = Array.isArray(channel.default) ? channel.default[j] : channel.default;
                let set = (newValue: typeof value) => {
                    value = newValue;
                    if (Array.isArray(channel.name) && channel.formatter != null)
                        this.dmxChannels[i] = (channel.formatter as (...values: Array<number | boolean>) => number)(...(channel.name.map(_ => (this as any)[_])));
                    else if (!Array.isArray(channel.name) && channel.formatter != null) {
                        let currentValue = property.includes('.') ? (this as any)[property.split('.')[0]][property.split('.')[1]] : (this as any)[property];
                        this.dmxChannels[i] = channel.formatter(currentValue);
                    } else if (Array.isArray(channel.name))
                        return;
                    else
                        this.dmxChannels[i] = Number(property.includes('.') ? (this as any)[property.split('.')[0]][property.split('.')[1]] : (this as any)[property]);
                    this.dmxChannels[i] = Math.round(this.dmxChannels[i]);
                    this.emit('propertyChanged', property, value);
                    this.emit('dmxChanged', i, this.dmxChannels[i]);
                }
                if (property.includes('.')) {
                    if((this as any)[property.split('.')[0]] == null)
                        (this as any)[property.split('.')[0]] = {};
                    Object.defineProperty((this as any)[property.split('.')[0]], property.split('.')[1], {
                        get: () => value,
                        set
                    });
                } else {
                    Object.defineProperty(this, property, {
                        get: () => value,
                        set
                    });
                }
            });
        });
    }

    toJSON() {
        let json: { [property: string]: any } = {};
        this.channels.forEach(channel => {
            if (channel.name == null) return;
            if (!Array.isArray(channel.name)) {
                if(channel.name.includes('.')) {
                    if(json[channel.name.split('.')[0]] == null)
                        json[channel.name.split('.')[0]] = {};
                    json[channel.name.split('.')[0]][channel.name.split('.')[1]] = (this as any)[channel.name.split('.')[0]][channel.name.split('.')[1]];
                } else
                    json[channel.name] = (this as any)[channel.name];
                return;
            }
            channel.name.forEach(property => {
                if(property.includes('.')) {
                    if(json[property.split('.')[0]] == null)
                        json[property.split('.')[0]] = {};
                    json[property.split('.')[0]][property.split('.')[1]] = (this as any)[property.split('.')[0]][property.split('.')[1]];
                } else
                    json[property] = (this as any)[property];
            });
        });
        return json;
    }
}

export default Device;