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
import { ProjectStatus } from '../models/project';
import { projectState } from '../state/project-state';
import { Autobind } from '../decorators/autobind';
import { ProjectItem } from './project-item';
export class ProjectList extends Component {
    constructor(type) {
        super('project__list', 'app', false, 'section__projects');
        this.type = type;
        this.assignedProjects = [];
        // so now before the instance methods are executed, we want to invoke the addListener method and return a function that reassigns the projects array to an array prop here
        projectState.addListener((projects) => {
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
    dragOverHandler(event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            // we need to prevent default because by default the browser does not allow dropping of an element
            event.preventDefault();
            const listEl = this.element.querySelector(`.project__list--${this.type}`);
            listEl.classList.add('dragging');
        }
    }
    dropHandler(event) {
        console.log(event.dataTransfer.getData('text/plain'));
        const prjId = event.dataTransfer.getData('text/plain');
        projectState.moveProject(prjId, this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished);
        // to remove the background color on both active and finished lists once the item has moved and dropped in the target
        document.querySelectorAll('.project__list').forEach((list) => {
            list.classList.remove('dragging');
        });
    }
    dragLeaveHandler(event) {
        const listEl = this.element.querySelector(`.project__list--${this.type}`);
        listEl.classList.remove('dragging');
    }
    // to satisfy the base class
    configure() {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
    }
    renderContent() {
        // to apply specific styles
        const headerClass = `project__header--${this.type}`;
        const listClasses = `project__list project__list--${this.type}`;
        const listId = `${this.type}__project__list`;
        this.element.querySelector('header').className = headerClass;
        this.element.querySelector('ul').id = listId;
        this.element.querySelector('ul').className = listClasses;
        this.element.querySelector('h2').textContent =
            `${this.type.toUpperCase()} PROJECTS`;
        this.element.querySelector('h3').textContent =
            `DRAG & DROP YOUR PROJECT TO ${this.type === 'active' ? 'FINISHED' : 'ACTIVE'} LIST`;
    }
    renderProject() {
        // to fix duplication: everytime this method is executed
        // we set the innerHTML of the list element to empty string
        const listEl = document.querySelector(`.project__list--${this.type}`);
        // type gaurd - early return if there is no list element
        if (!listEl)
            return;
        // this line gets rid of duplication
        listEl.textContent = '';
        // loop through the assignedProjects
        for (const project of this.assignedProjects) {
            // now that we have created a separate class for
            // creating a list item element and rendering it to the host element, we can call it here and pass in the constructors args
            // we need the host element which will be the unordered list element within section__projects, which is the element on project__list template.
            console.log(this.element);
            const hostElementId = this.element.querySelector('ul').id;
            console.log(hostElementId);
            console.log(project);
            new ProjectItem(hostElementId, project, this.type);
        }
    }
}
__decorate([
    Autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectList.prototype, "dragOverHandler", null);
__decorate([
    Autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectList.prototype, "dropHandler", null);
__decorate([
    Autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DragEvent]),
    __metadata("design:returntype", void 0)
], ProjectList.prototype, "dragLeaveHandler", null);
//# sourceMappingURL=project-list.js.map