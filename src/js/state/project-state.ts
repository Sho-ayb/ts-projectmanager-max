// imports

import { Project, ProjectStatus } from '../models/project';

// Creating a type for listeners array and we know it returns nothing
type Listener<T> = (items: T[]) => void;

// Creating a state class for ProjectState to inherit from

class State<T> {
  // a listener array holding listener functions
  protected listeners: Listener<T>[] = [];

  addListener(listenerFn: Listener<T>) {
    this.listeners.push(listenerFn);
  }
}

// Creating a class to track the applications state

class ProjectState extends State<Project> {
  // new projects will be stored here in one place
  private projects: Project[] = [];
  // since method is static; this prop has to be static too
  private static instance: ProjectState;

  private constructor() {
    // must contain a super now because this is a class
    // inheriting from State
    super();
  }

  // singleton static method
  static getInstance() {
    if (this.instance) {
      return this.instance;
    }

    this.instance = new ProjectState();
    return this.instance;
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
    this.updateListeners();
  }

  moveProject(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find((prj) => prj.id === projectId);

    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  updateListeners() {
    // when a project is added, we need to loop through the listeners array and invoke the listenerFn and pass in a shallow copy of the projects array
    for (const listenerFn of this.listeners) {
      // remember that listenerFn is actual function as per addListener argument.
      listenerFn(this.projects.slice());
    }
  }
}

// Creating a global instance
export const projectState = ProjectState.getInstance();
