import DeviceElement from "./DeviceElement";

let newCreateProps: {type: string, parent: Element | null, children: Array<Element>, attributes: {[attribute: string]: string | boolean | number}} = {type: "", parent: null, children: [], attributes: {}};
export function  setNewCreateProps(type: string, parent: Element | null, children: Array<Element>, attributes: {[attribute: string]: string | boolean | number}) {
    newCreateProps = {type, parent, children, attributes};
}

class Element {
    public children: Array<Element>;
    public attributes: {[attribute: string]: string | boolean | number};
    public type: string;
    public parent: Element | null;

    public constructor() {
        this.type = newCreateProps.type;
        this.parent = newCreateProps.parent;
        this.children = newCreateProps.children;
        this.attributes = newCreateProps.attributes;
        newCreateProps = {type: "", parent: null, children: [], attributes: {}};
    }

    public find<T extends Element>(query: string): T {
        return this.children.find(child => child.type == query) as T;
    }

    public filter<T extends Element>(query: string): Array<T> {
        // return [new DeviceElement() as any];
        return [
            ...this.children.filter(child => child.type == query),
            ...this.children.map(child => child.filter(query))
                .reduce((a, b) => {a.push(...b); return a}, [])
        ] as Array<T>;
    }
}

export default Element;