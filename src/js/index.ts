'use-strict';

// importing the style file
import '../scss/style.scss';

class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;

  constructor() {
    // getting the elements
    this.templateElement = document.getElementById(
      'project__input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    const importNode = document.importNode(this.templateElement.content, true);

    console.log(importNode);

    this.element = importNode.firstElementChild as HTMLFormElement;

    console.log(this.element);

    this.element.id = 'user-input';
    this.hostElement.className = '[ space-around-sm flex-center ]';

    this.attach();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }
}

const prjInput = new ProjectInput();
