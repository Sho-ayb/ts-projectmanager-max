// imports

import { Component } from './abstract-component';
import { DragTarget } from '../models/interfaces';
import { Project, ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import { Autobind } from '../decorators/autobind';
import { ProjectItem } from './project-item';

export class ProjectList
  extends Component<HTMLElement, HTMLUListElement>
  implements DragTarget
{
  assignedProjects: Project[];

  constructor(private type: 'active' | 'finished') {
    super('project__list', 'app', false, 'section__projects');
    this.assignedProjects = [];

    // so now before the instance methods are executed, we want to invoke the addListener method and return a function that reassigns the projects array to an array prop here

    projectState.addListener((projects: Project[]): void => {
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

  // implements DragTarget interface
  @Autobind
  dragOverHandler(event: DragEvent): void {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      // we need to prevent default because by default the browser does not allow dropping of an element
      event.preventDefault();
      const listEl = this.element.querySelector(
        `.project__list--${this.type}`
      )!;
      listEl.classList.add('dragging');
    }
  }

  @Autobind
  dropHandler(event: DragEvent): void {
    console.log(event.dataTransfer!.getData('text/plain'));

    const prjId = event.dataTransfer!.getData('text/plain');

    projectState.moveProject(
      prjId,
      this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
    );

    // to remove the background color on both active and finished lists once the item has moved and dropped in the target
    document.querySelectorAll('.project__list').forEach((list) => {
      list.classList.remove('dragging');
    });
  }

  @Autobind
  dragLeaveHandler(event: DragEvent): void {
    const listEl = this.element.querySelector(`.project__list--${this.type}`)!;
    listEl.classList.remove('dragging');
  }

  // to satisfy the base class
  public configure() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
  }

  public renderContent(): void {
    // to apply specific styles
    const headerClass = `project__header--${this.type}`;
    const listClasses = `project__list project__list--${this.type}`;
    const listId = `${this.type}__project__list`;
    this.element.querySelector('header')!.className = headerClass;
    this.element.querySelector('ul')!.id = listId;
    this.element.querySelector('ul')!.className = listClasses;
    this.element.querySelector('h2')!.textContent =
      `${this.type.toUpperCase()} PROJECTS`;
    this.element.querySelector('h3')!.textContent =
      `DRAG & DROP YOUR PROJECT TO ${this.type === 'active' ? 'FINISHED' : 'ACTIVE'} LIST`;
  }

  private renderProject(): void {
    // to fix duplication: everytime this method is executed
    // we set the innerHTML of the list element to empty string

    const listEl = document.querySelector(
      `.project__list--${this.type}`
    )! as HTMLUListElement;

    // type gaurd - early return if there is no list element
    if (!listEl) return;

    // this line gets rid of duplication
    listEl.textContent = '';

    // loop through the assignedProjects

    for (const project of this.assignedProjects) {
      // now that we have created a separate class for
      // creating a list item element and rendering it to the host element, we can call it here and pass in the constructors args

      // we need the host element which will be the unordered list element within section__projects, which is the element on project__list template.

      console.log(this.element);

      const hostElementId = this.element.querySelector('ul')!.id;
      console.log(hostElementId);

      console.log(project);

      new ProjectItem(hostElementId, project, this.type);
    }
  }
}
