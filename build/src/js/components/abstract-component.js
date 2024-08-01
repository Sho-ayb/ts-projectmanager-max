// Creating an abstract class here that class's with these generaic types will inherit from
export class Component {
    constructor(templateId, hostElementId, insertAtStart, newElementId) {
        // getting the elements
        this.templateElement = document.getElementById(templateId);
        this.hostElement = document.getElementById(hostElementId);
        // this returns a document fragment
        const importNode = document.importNode(this.templateElement.content, true);
        // we now have the form element itself
        this.element = importNode.firstElementChild;
        // we can add id and class names
        this.element.id = newElementId;
        // will force all other inherited class's to contain these methods
        this.attach(insertAtStart);
    }
    // All inheriting class's get this method
    attach(insertAtBeginning) {
        this.hostElement.insertAdjacentElement(insertAtBeginning ? 'afterbegin' : 'beforeend', this.element);
    }
}
//# sourceMappingURL=abstract-component.js.map