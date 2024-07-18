'use-strict';

// importing the style file
import '../scss/style.scss';

// Autobind decorator

function Autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
): PropertyDescriptor {
  // need to get the original method from the descriptor

  const originalMethod = descriptor.value;

  console.log(originalMethod);

  // create a new adjusted property descriptor object here

  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    enumerable: false,

    // a getter method

    get() {
      // lets now create a variable that is bound to the "this ref" of the original method

      const boundFn = originalMethod.bind(this);
      return boundFn;
    },
  };

  // finally return the adjusted descriptor

  return adjDescriptor;
}

// ProjectInput class
class ProjectInput {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  titleInputEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  peopleEl: HTMLInputElement;

  constructor() {
    // getting the elements
    this.templateElement = document.getElementById(
      'project__input'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;

    // this returns a document fragment
    const importNode = document.importNode(this.templateElement.content, true);

    // we now have the form element itself
    this.element = importNode.firstElementChild as HTMLFormElement;

    console.log(this.element);
    // we can add id and class names
    this.element.id = 'user-input';
    this.hostElement.className = '[ space-around-sm flex-center ]';

    // we need to extract the inputs from the form fields

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleEl = this.element.querySelector('#people') as HTMLInputElement;

    // invoking the class method to insert the element in to div element with the class name of app
    this.attach();
    // setup event listener
    this.configure();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('afterbegin', this.element);
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    console.log(this.titleInputEl.value);
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
}

const prjInput = new ProjectInput();
