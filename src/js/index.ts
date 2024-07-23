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

// a new interface object to validate user inputs

interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

// a function to handle valid inputs

function validInput(validInput: Validatable): boolean {
  // keep a variable here to determine to return truthy || falsy
  let isValid = true;

  // checking if anything is entered as an input
  if (validInput.required) {
    // this checks if isValid is truthy and then converts the value of this input to a string, because a validInput could also be a number. We get rid of empty spaces using trim() and then check its length and if it is not equal to 0 then the && operator will return a truthy.
    isValid = isValid && validInput.value.toString().trim().length !== 0;
  }

  // our inputs have also a minLength but because all are validatables are optional, we need to check if the prop is a null or undefined and != null returns both and we also check if the validInputs value is a string.
  if (validInput.minLength != null && typeof validInput.value === 'string') {
    isValid =
      isValid && validInput.value.toString().length > validInput.minLength;
  }

  if (validInput.maxLength != null && typeof validInput.value === 'string') {
    isValid =
      isValid && validInput.value.toString().length <= validInput.maxLength;
  }

  if (validInput.min != null && typeof validInput.value === 'number') {
    isValid = isValid && validInput.value >= validInput.min;
  }

  if (validInput.max != null && typeof validInput.value === 'number') {
    isValid = isValid && validInput.value <= validInput.max;
  }

  // in the end we ruturn a boolean
  return isValid;
}

// Creating a class to track the applications state

class ProjectState {
  // a listener array holding listener functions
  private listeners: any[] = [];

  // new projects will be stored here in one place
  private projects: any[] = [];
  // since method is static; this prop has to be static too
  private static instance: ProjectState;

  private constructor() {}

  // singleton static method
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
  }

  addListener(listenerFn: Function) {
    this.listeners.push(listenerFn);
    console.log(listenerFn);
    console.log(this.listeners);
  }

  // public instance method
  addProject(title: string, description: string, numOfPeople: number): void {
    // creating an object
    const newProject = {
      id: Math.random().toString(),
      title: title,
      description: description,
      people: numOfPeople,
    };

    // push this object to the array
    this.projects.push(newProject);
    // when a project is added, we need to loop through the listeners array and invoke the listenerFn and pass in a shallow copy of the projects array
    for (const listenerFn of this.listeners) {
      // remember that listenerFn is actual function as per addListener argument.
      listenerFn(this.projects.slice());
    }
  }
}

// Creating a global instance
const projectState = ProjectState.getInstance();

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
    this.element.id = 'user__input';
    this.hostElement.className = '[ space-around-sm flex-center flex-column ]';

    // we need to extract the inputs from the form fields and
    // assign it to the class properties above

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

  private clearInputs() {
    this.titleInputEl.value =
      this.descriptionEl.value =
      this.peopleEl.value =
        '';
  }

  @Autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    // gather the user inputs
    const userInput = this.gatherUserInputs();
    // what is actually returned is a tuple but a tuple is just an array, so we can check if what is returned is indeed an array
    if (Array.isArray(userInput)) {
      // we can destructure
      const [title, desc, people] = userInput;

      console.log(title, desc, people);

      // invoke the public method to add a project
      projectState.addProject(title, desc, people);
    }

    // once submitted clear all the inputs
    this.clearInputs();
  }

  private configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

  private gatherUserInputs(): [string, string, number] | void {
    // we can get the form input values via the elements value property
    const titleInput = this.titleInputEl.value;
    const descInput = this.descriptionEl.value;
    const peopleInput = this.peopleEl.value;

    // lets create objects here that conforms to the Validatable interface

    const titleValidatable: Validatable = {
      value: titleInput,
      required: true,
      minLength: 5,
    };

    const descriptionValidatable: Validatable = {
      value: descInput,
      required: true,
      minLength: 5,
    };

    const peopleValidatable: Validatable = {
      value: +peopleInput,
      required: true,
      min: 1,
      max: 5,
    };

    // we can check if the inputs a valid - inverting truthies, so if any are falsy, it will execute the first if statement

    if (
      !validInput(titleValidatable) &&
      !validInput(descriptionValidatable) &&
      !validInput(peopleValidatable)
    ) {
      throw new Error('Please enter a valid input');
    } else {
      return [titleInput, descInput, +peopleInput];
    }
  }
}

class ProjectList {
  templateElement: HTMLTemplateElement;
  hostElement: HTMLDivElement;
  element: HTMLElement;
  assignedProjects: any[];

  constructor(private type: 'active' | 'finished') {
    // getting the elements
    this.templateElement = document.getElementById(
      'project__list'
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById('app')! as HTMLDivElement;
    this.assignedProjects = [];
    console.log(this.assignedProjects);
    // this returns a document fragment
    const importNode = document.importNode(this.templateElement.content, true);

    // we now have the form element itself
    this.element = importNode.firstElementChild as HTMLFormElement;

    console.log(this.element);

    // so now before the instance methods are executed, we want to invoke the addListener method and return a function that reassigns the projects array to an array prop here

    projectState.addListener((projects: any[]) => {
      this.assignedProjects = projects;
      console.log(this.assignedProjects);
      this.renderProject();
    });

    // invoke instance methods
    this.attach();
    this.renderContent();
  }

  private attach() {
    this.hostElement.insertAdjacentElement('beforeend', this.element);
  }

  private renderContent() {
    // to apply specific styles
    const headerId = `project__header--${this.type}`;
    const listId = `project__list--${this.type}`;
    this.element.querySelector('header').className = headerId;
    this.element.querySelector('ul').className = listId;
    this.element.querySelector('h2').textContent =
      `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProject() {
    const listEl = document.querySelector(
      `.project__list--${this.type}`
    )! as HTMLUListElement;

    // loop through the assignedProjects

    for (const projects of this.assignedProjects) {
      // create a list item
      const listItem = document.createElement('li');

      listItem.textContent = `${projects.title}`;

      listEl.appendChild(listItem);
    }
  }
}

const init = () => {
  try {
    const prjInput = new ProjectInput();
    const prjActiveList = new ProjectList('active');
    const prjFinishedList = new ProjectList('finished');
  } catch (error) {
    console.log('Error: ' + error.message);
  }
};

init();
