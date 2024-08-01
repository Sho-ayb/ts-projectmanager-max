// imports
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from './abstract-component';
import { Autobind } from '../decorators/autobind';
// Creating a class specifically for rendering the Project  List Items in the unordered list
export class ProjectItem extends Component {
    // Creating a getter here to return a better output to render number of people correctly
    get persons() {
        if (this.project.numOfPeople === 1) {
            return '1 person';
        }
        else {
            return `${this.project.numOfPeople} persons`;
        }
    }
    constructor(hostElId, project, type) {
        super('single__project', hostElId, false, project.id);
        this.project = project;
        this.type = type;
        this.configure();
        this.renderContent();
    }
    // need to implement these as per the interface Draggable
    dragStartHandler(event) {
        console.log(event);
        this.element.classList.add('dragging');
        // on the event, there is a dataTransfer property which has a method that takes two args: the type of data allowed and we are passing in the projects id, so that we can capture this when the element is dropped in to the target element.
        event.dataTransfer.setData('text/plain', this.project.id);
        event.dataTransfer.effectAllowed = 'move';
    }
    dragEndHandler(event) {
        console.log('DragEnd');
    }
    configure() {
        this.element.classList.add('project__list__item');
        this.element.classList.add(`project__list__item--${this.type}`);
        // attach an event listener on to the element
        this.element.addEventListener('dragstart', this.dragStartHandler);
        this.element.addEventListener('dragend', this.dragEndHandler);
    }
    renderContent() {
        this.element.querySelector('h2').textContent = this.project.title;
        this.element.querySelector('h3').textContent = this.persons + ' assigned';
        this.element.querySelector('p').textContent = this.project.description;
    }
}
__decorate([
    Autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectItem.prototype, "dragStartHandler", null);
__decorate([
    Autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectItem.prototype, "dragEndHandler", null);
//# sourceMappingURL=project-item.js.map