// imports

import { Component } from './abstract-component';
import { Draggable } from '../models/interfaces';
import { Project } from '../models/project';
import { Autobind } from '../decorators/autobind';

// Creating a class specifically for rendering the Project  List Items in the unordered list

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  // creating a class prop here that is of type Project
  // so that we can use it in renderContent method
  private project: Project;
  private type: 'active' | 'finished';

  // Creating a getter here to return a better output to render number of people correctly
  get persons() {
    if (this.project.numOfPeople === 1) {
      return '1 person';
    } else {
      return `${this.project.numOfPeople} persons`;
    }
  }

  constructor(hostElId: string, project: Project, type: 'active' | 'finished') {
    super('single__project', hostElId, false, project.id);
    this.project = project;
    this.type = type;

    this.configure();
    this.renderContent();
  }

  // need to implement these as per the interface Draggable
  @Autobind
  dragStartHandler(event: DragEvent): void {
    console.log(event);
    this.element.classList.add('dragging');
    // on the event, there is a dataTransfer property which has a method that takes two args: the type of data allowed and we are passing in the projects id, so that we can capture this when the element is dropped in to the target element.
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
  }

  @Autobind
  dragEndHandler(event: DragEvent): void {
    console.log('DragEnd');
  }

  public configure(): void {
    this.element.classList.add('project__list__item');
    this.element.classList.add(`project__list__item--${this.type}`);

    // attach an event listener on to the element
    this.element.addEventListener('dragstart', this.dragStartHandler);
    this.element.addEventListener('dragend', this.dragEndHandler);
  }

  public renderContent(): void {
    this.element.querySelector('h2')!.textContent = this.project.title;
    this.element.querySelector('h3')!.textContent = this.persons + ' assigned';
    this.element.querySelector('p')!.textContent = this.project.description;
  }
}
