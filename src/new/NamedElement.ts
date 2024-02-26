import Element from "./Element";

class NamedElement extends Element {
    public name: string;

    public constructor() {
        super();
        this.name = this.attributes['name'].toString();
    }
}

export default NamedElement;