import Element, { setNewCreateProps } from "./Element";
import * as xml2js from 'xml2js';
import * as fs from "fs/promises";

class XMLParser {
    private parser;
    public root: Element;

    public constructor(private registertElements: {[nodeName: string]: new() => Element} = {}) {
        this.root = new Element();
        this.parser = new xml2js.Parser({normalize: true, explicitChildren: true, preserveChildrenOrder: true, explicitRoot: true});
    }

    public async parse(path: string) {
        let content = await fs.readFile(path, 'utf-8');
        let data: any = await new Promise((resolve, reject) => this.parser.parseString(content, (error, result) => {
            if(error) reject(error);
            resolve(result);
        }));
        this.root = this.parseElement(data[Object.keys(data)[0]]);
    }

    private parseElement(data: any): Element {
        setNewCreateProps(data['#name'], null, data["$$"]?.map((_: any) => this.parseElement(_)) ?? [], data['$'] ?? {});
        let element = new (this.registertElements[data['#name']] ?? Element);
        element.children.forEach(child => child.parent = element);
        return element;
    }

    public async save(path: string) {

    }
}

export default XMLParser;