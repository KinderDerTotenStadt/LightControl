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
        this.root = this.parseElement(data[Object.keys(data)[0]], null, null);
    }

    private parseElement(data: any, parent: Element | null, root: Element | null): Element {
        setNewCreateProps(data['#name'], parent, root, data['$'] ?? {});
        let element = new (this.registertElements[data['#name']] ?? Element);
        element.children = data["$$"]?.map((_: any) => this.parseElement(_, element, root ?? element)) ?? [];
        return element;
    }

    public async save(path: string) {

    }
}

export default XMLParser;