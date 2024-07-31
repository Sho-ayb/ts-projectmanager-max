// Creating an abstract class here that class's with these generaic types will inherit from

export abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId: string
  ) {
    // getting the elements
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;

    // this returns a document fragment
    const importNode = document.importNode(this.templateElement.content, true);

    // we now have the form element itself
    this.element = importNode.firstElementChild as U;

    // we can add id and class names
    this.element.id = newElementId;

    // will force all other inherited class's to contain these methods
    this.attach(insertAtStart);
  }

  // Any method with abstract need to be invoked within the constructor and declared as a method in the inheriting class.
  abstract configure(): void;
  abstract renderContent(): void;

  // All inheriting class's get this method
  private attach(insertAtBeginning: Boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBeginning ? 'afterbegin' : 'beforeend',
      this.element
    );
  }
}
