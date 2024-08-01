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
import { Autobind } from '../decorators/autobind';
import { Component } from './abstract-component';
import { projectState } from '../state/project-state';
import { validInput } from '../util/validation';
import { showModal } from '../util/show-modal';
// ProjectInput class
export class ProjectInput extends Component {
    constructor() {
        // super ensures that this class gets the constructor of its parent Component
        super('project__input', 'app', true, 'user__input');
        this.hostElement.className = '[ space-around-sm flex-center flex-column ]';
        // setup event listener
        this.configure();
    }
    // All public class's should be before any private class's.
    configure() {
        // we need to extract the inputs from the form fields and
        // assign it to the class properties above
        this.titleInputEl = this.element.querySelector('#title');
        this.descriptionEl = this.element.querySelector('#description');
        this.peopleEl = this.element.querySelector('#people');
        this.element.addEventListener('submit', (event) => {
            try {
                this.submitHandler(event);
            }
            catch (error) {
                if (error instanceof Error) {
                    showModal(`${error.message}`);
                }
            }
        });
    }
    // we should call renderContent here to satisfy the base class
    // even though we don't need it here in this class.
    renderContent() { }
    clearInputs() {
        this.titleInputEl.value =
            this.descriptionEl.value =
                this.peopleEl.value =
                    '';
    }
    submitHandler(event) {
        event.preventDefault();
        // need a try catch here to catch an error and pass it to a higher level so that init function can catch it.
        try {
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
        catch (error) {
            if (error instanceof Error) {
                // throwing error to the event listener
                throw error;
            }
        }
    }
    gatherUserInputs() {
        // we can get the form input values via the elements value property
        const titleInput = this.titleInputEl.value;
        const descInput = this.descriptionEl.value;
        const peopleInput = this.peopleEl.value;
        // lets create objects here that conforms to the Validatable interface
        const titleValidatable = {
            value: titleInput,
            required: true,
            minLength: 5,
        };
        const descriptionValidatable = {
            value: descInput,
            required: true,
            minLength: 5,
        };
        const peopleValidatable = {
            value: +peopleInput,
            required: true,
            min: 1,
            max: 5,
        };
        const titleError = validInput(titleValidatable);
        const descError = validInput(descriptionValidatable);
        const peopleError = validInput(peopleValidatable);
        const errorMarkup = `
      
      Please enter a valid input:
      ${titleError ? `Title: ${titleError}` : ''} 
      ${descError ? `Description: ${descError}` : ''}
      ${peopleError ? `Number of people: ${peopleError}` : ''}
    
    `;
        // Because the validInput returns a null falsy value as a truthy in the validation.ts file ternary operator, we can create a simple check here without negating the values.
        if (titleError || descError || peopleError) {
            throw new Error(errorMarkup);
        }
        else {
            return [titleInput, descInput, +peopleInput];
        }
    }
}
__decorate([
    Autobind,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Event]),
    __metadata("design:returntype", void 0)
], ProjectInput.prototype, "submitHandler", null);
//# sourceMappingURL=project-input.js.map