import DeviceElement from "./DeviceElement";

let newCreateProps: {type: string, parent: Element | null, root: Element | null, attributes: {[attribute: string]: string | boolean | number}} = {type: "", parent: null, root: null, attributes: {}};
export function  setNewCreateProps(type: string, parent: Element | null, root: Element | null, attributes: {[attribute: string]: string | boolean | number}) {
    newCreateProps = {type, parent, root, attributes};
}

class Element {
    public type: string;
    public parent: Element;
    public root: Element;
    public attributes: {[attribute: string]: string | boolean | number};
    public children: Array<Element>;

    public constructor() {
        this.type = newCreateProps.type;
        this.root = newCreateProps.root ?? this;
        this.parent = newCreateProps.parent ?? this.root;
        this.attributes = newCreateProps.attributes;
        this.children = [];
        newCreateProps = {type: "", parent: null, root: null, attributes: {}};
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