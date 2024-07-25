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

// a new interface object to validate user inputs

interface Validatable {
  value: string | number;
  required: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

enum ProjectStatus {
  Active,
  Finished,
}

// Creating a class to create Projects
class Project {
  // using the shorthand way of defining class properties
  constructor(
    public id: string,
    public title: string,
    public description: string,
    public numOfPeople: number,
    public status: ProjectStatus
  ) {}
}

// Creating a type for listeners array and we know it returns nothing
type Listener = (items: Project[]) => void;

// Creating a class to track the applications state

class ProjectState {
  // a listener array holding listener functions
  private listeners: Listener[] = [];

  // new projects will be stored here in one place
  private projects: Project[] = [];
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

  addListener(listenerFn: Listener) {
    this.listeners.push(listenerFn);
    console.log(listenerFn);
    console.log(this.listeners);
  }

  // public instance method
  addProject(title: string, description: string, numOfPeople: number): void {
    // create an id
    const id = Math.random().toString();

    // creating an object
    const newProject = new Project(
      id,
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    );

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

// Creating an abstract class here that class's with these generaic types will inherit from

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string,
    hostElementId: string,
    insertAtStart: boolean,
    newElementId?: string
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

// ProjectInput class
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputEl: HTMLInputElement;
  descriptionEl: HTMLInputElement;
  peopleEl: HTMLInputElement;

  constructor() {
    // super ensures that this class gets the constructor of its parent Component
    super('project__input', 'app', true, 'user__input');

    this.hostElement.className = '[ space-around-sm flex-center flex-column ]';

    // setup event listener
    this.configure();
  }

  // All public class's should be before any private class's.
  public configure() {
    // we need to extract the inputs from the form fields and
    // assign it to the class properties above

    this.titleInputEl = this.element.querySelector(
      '#title'
    ) as HTMLInputElement;
    this.descriptionEl = this.element.querySelector(
      '#description'
    ) as HTMLInputElement;
    this.peopleEl = this.element.querySelector('#people') as HTMLInputElement;

    this.element.addEventListener('submit', this.submitHandler);
  }

  // we should call renderContent here to satisfy the base class
  // even though we don't need it here in this class.
  renderContent(): void {}

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

class ProjectList extends Component<HTMLElement, HTMLUListElement> {
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project__list', 'app', false, 'section__projects');
    this.assignedProjects = [];

    // so now before the instance methods are executed, we want to invoke the addListener method and return a function that reassigns the projects array to an array prop here

    projectState.addListener((projects: Project[]) => {
      // filtering the active and finished projects
      const resolvedProjects = projects.filter((project) => {
        if (this.type === 'active') {
          return project.status === ProjectStatus.Active;
        }

        return project.status === ProjectStatus.Finished;
      });

      this.assignedProjects = resolvedProjects;
      console.log(this.assignedProjects);
      this.renderProject();
    });

    // invoke instance methods
    this.configure();
    this.renderContent();
  }

  // to satisfy the base class
  public configure() {}

  public renderContent() {
    // to apply specific styles
    const headerId = `project__header--${this.type}`;
    const listId = `project__list project__list--${this.type}`;
    this.element.querySelector('header').className = headerId;
    this.element.querySelector('ul').className = listId;
    this.element.querySelector('h2').textContent =
      `${this.type.toUpperCase()} PROJECTS`;
  }

  private renderProject() {
    // to fix duplication: everytime this method is executed
    // we set the innerHTML of the list element to empty string

    const listEl = document.querySelector(
      `.project__list--${this.type}`
    )! as HTMLUListElement;

    listEl.textContent = '';

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
